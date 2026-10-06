import request from 'supertest';
import crypto from 'crypto';
import app from '../../src/main';
import { db } from '../../src/database/db';
import { TEST_CREDENTIALS, SEED_USERS } from '../../src/database/seed-data';
import {
  getStorageService,
  setStorageService,
  MemoryStorageService,
  S3StorageService,
} from '../../src/common/storage/storage.service';
import {
  getMalwareScanner,
  setMalwareScanner,
  MockMalwareScanner,
  EICAR_TEST_SIGNATURE,
} from '../../src/common/services/malware-scanner.service';
import { rateLimiter } from '../../src/common/services/rate-limiter.service';
import { validateProductionStartup } from '../../src/common/config/startup-validator';

function extractSession(res: request.Response) {
  const cookies: string[] = res.get('Set-Cookie') || [];
  let sessionCookie = '';
  let csrfCookie = '';
  let csrfToken = '';

  cookies.forEach((c) => {
    if (c.startsWith('panacea_session=')) sessionCookie = c.split(';')[0];
    if (c.startsWith('panacea_csrf=')) {
      csrfCookie = c.split(';')[0];
      csrfToken = csrfCookie.replace('panacea_csrf=', '');
    }
  });

  return {
    cookieHeader: [sessionCookie, csrfCookie].filter(Boolean).join('; '),
    csrfToken: csrfToken || res.body.data?.csrfToken || '',
  };
}

describe('PANACEA P0 INFRASTRUCTURE & STORAGE HARDENING SUITE', () => {
  let iciciAuth: ReturnType<typeof extractSession>;
  let axisAuth: ReturnType<typeof extractSession>;

  beforeAll(async () => {
    const iciciLogin = await request(app).post('/api/v1/auth/login').send({
      email: TEST_CREDENTIALS.iciciAdmin.email,
      password: TEST_CREDENTIALS.iciciAdmin.password,
    });
    iciciAuth = extractSession(iciciLogin);

    const axisLogin = await request(app).post('/api/v1/auth/login').send({
      email: TEST_CREDENTIALS.axisUser.email,
      password: TEST_CREDENTIALS.axisUser.password,
    });
    axisAuth = extractSession(axisLogin);
  });

  describe('1. Real Object Storage & Private Bucket Architecture', () => {
    it('stores uploaded document in StorageService abstraction and keeps object private', async () => {
      const pdfBytes = Buffer.from('%PDF-1.4\n%Panacea Certified Section 14 Court Order\n%%EOF');
      const expectedChecksum = crypto.createHash('sha256').update(pdfBytes).digest('hex');

      const uploadRes = await request(app)
        .post('/api/v1/cases/c1111111-1111-1111-1111-111111111111/documents/upload')
        .set('Cookie', iciciAuth.cookieHeader)
        .set('X-CSRF-Token', iciciAuth.csrfToken)
        .attach('file', pdfBytes, 'Certified_DM_Order.pdf');

      expect(uploadRes.status).toBe(201);
      const docId = uploadRes.body.data.id;
      expect(docId).toBeDefined();

      // Verify that internal storage key is NEVER leaked in client response
      expect(uploadRes.body.data.storage_key).toBeUndefined();
      expect(uploadRes.body.data.storageKey).toBeUndefined();

      // Verify document exists in StorageService
      const docRecord = await db.getDocumentById(docId);
      expect(docRecord).toBeDefined();
      expect(docRecord!.storage_key).toMatch(/^documents\/[a-f0-9-]+\/[a-f0-9-]+\/v1\/[a-f0-9-]+/);

      // Verify key has NO PII (no borrower names, account numbers, or case titles)
      expect(docRecord!.storage_key).not.toContain('Certified_DM_Order');
      expect(docRecord!.storage_key).not.toContain('ICICI');

      const storage = getStorageService();
      const objectExists = await storage.objectExists(docRecord!.storage_key);
      expect(objectExists).toBe(true);

      const retrievedBytes = await storage.getObject(docRecord!.storage_key);
      expect(retrievedBytes.toString('utf8')).toBe(pdfBytes.toString('utf8'));
    });

    it('handles non-existent document ID safely with 404 without leaking server path', async () => {
      const res = await request(app)
        .get('/api/v1/documents/00000000-0000-0000-0000-000000000000/stream')
        .set('Cookie', iciciAuth.cookieHeader);

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
      expect(res.body.error.message).toBe('Document not found.');
    });

    it('fails closed when object storage is unavailable: does not publish document', async () => {
      const failingStorage = new MemoryStorageService();
      // Override putObject to simulate S3 / MinIO downtime
      jest.spyOn(failingStorage, 'putObject').mockRejectedValueOnce(new Error('S3 Connection Timed Out (503)'));

      const originalStorage = getStorageService();
      setStorageService(failingStorage);

      const docsBeforeCount = db.documents.length;

      try {
        const uploadRes = await request(app)
          .post('/api/v1/cases/c1111111-1111-1111-1111-111111111111/documents/upload')
          .set('Cookie', iciciAuth.cookieHeader)
          .set('X-CSRF-Token', iciciAuth.csrfToken)
          .attach('file', Buffer.from('%PDF-1.4\n%Storage Outage Probe\n%%EOF'), 'Outage_Test.pdf');

        // MUST FAIL CLOSED (503 Service Unavailable)
        expect(uploadRes.status).toBe(503);
        expect(uploadRes.body.error.code).toBe('STORAGE_UNAVAILABLE');

        // MUST NOT create a database record
        expect(db.documents.length).toBe(docsBeforeCount);
      } finally {
        setStorageService(originalStorage);
      }
    });

    it('rejects downloading deleted documents even if caller possesses previously generated grant', async () => {
      // 1. Upload doc
      const uploadRes = await request(app)
        .post('/api/v1/cases/c1111111-1111-1111-1111-111111111111/documents/upload')
        .set('Cookie', iciciAuth.cookieHeader)
        .set('X-CSRF-Token', iciciAuth.csrfToken)
        .attach('file', Buffer.from('%PDF-1.4\n%Deletion test\n%%EOF'), 'Deletion_Test.pdf');

      const docId = uploadRes.body.data.id;

      // 2. Obtain grant
      const grantRes = await request(app)
        .post(`/api/v1/documents/${docId}/download`)
        .set('Cookie', iciciAuth.cookieHeader)
        .set('X-CSRF-Token', iciciAuth.csrfToken);

      const grantToken = new URL(`http://localhost${grantRes.body.data.downloadUrl}`).searchParams.get('grant');

      // 3. Delete document
      const delRes = await request(app)
        .delete(`/api/v1/documents/${docId}`)
        .set('Cookie', iciciAuth.cookieHeader)
        .set('X-CSRF-Token', iciciAuth.csrfToken);
      expect(delRes.status).toBe(200);

      // 4. Attempt to download deleted document -> MUST BE FORBIDDEN
      const streamRes = await request(app).get(`/api/v1/documents/${docId}/stream?grant=${grantToken}`);
      expect([403, 404]).toContain(streamRes.status);
    });
  });

  describe('2. Real Malware Scanning & Fail-Closed Behavior', () => {
    it('accepts clean documents and marks them clean', async () => {
      const cleanPdf = Buffer.from('%PDF-1.4\n%Known clean court summons document\n%%EOF');
      const uploadRes = await request(app)
        .post('/api/v1/cases/c1111111-1111-1111-1111-111111111111/documents/upload')
        .set('Cookie', iciciAuth.cookieHeader)
        .set('X-CSRF-Token', iciciAuth.csrfToken)
        .attach('file', cleanPdf, 'Clean_Summons.pdf');

      expect(uploadRes.status).toBe(201);
      expect(uploadRes.body.data.status).toBe('available');
    });

    it('rejects infected file containing EICAR antivirus test signature with 422', async () => {
      const infectedPdf = Buffer.from(`%PDF-1.4\n${EICAR_TEST_SIGNATURE}\n%%EOF`);

      const uploadRes = await request(app)
        .post('/api/v1/cases/c1111111-1111-1111-1111-111111111111/documents/upload')
        .set('Cookie', iciciAuth.cookieHeader)
        .set('X-CSRF-Token', iciciAuth.csrfToken)
        .attach('file', infectedPdf, 'Infected_Payload.pdf');

      expect(uploadRes.status).toBe(422);
      expect(uploadRes.body.error.code).toBe('MALWARE_DETECTED');
      expect(uploadRes.body.error.message).toContain('Malware scan failed');
    });

    it('fails closed when malware scanner is unavailable: does NOT assume clean or publish', async () => {
      const mockScanner = new MockMalwareScanner();
      mockScanner.setSimulateFailure(true);

      const originalScanner = getMalwareScanner();
      setMalwareScanner(mockScanner);

      const docsBeforeCount = db.documents.length;

      try {
        const uploadRes = await request(app)
          .post('/api/v1/cases/c1111111-1111-1111-1111-111111111111/documents/upload')
          .set('Cookie', iciciAuth.cookieHeader)
          .set('X-CSRF-Token', iciciAuth.csrfToken)
          .attach('file', Buffer.from('%PDF-1.4\n%Scanner Outage Probe\n%%EOF'), 'Scanner_Down.pdf');

        // MUST FAIL CLOSED: 503 SCAN_FAILED
        expect(uploadRes.status).toBe(503);
        expect(uploadRes.body.error.code).toBe('SCAN_FAILED');

        // MUST NOT publish document
        expect(db.documents.length).toBe(docsBeforeCount);
      } finally {
        setMalwareScanner(originalScanner);
      }
    });
  });

  describe('3. Actual Byte Checksum Verification & Stability', () => {
    it('produces identical SHA-256 hash for identical byte uploads', async () => {
      const exactBytes = Buffer.from('%PDF-1.4\n%Exact Byte Stability Verification 1001\n%%EOF');
      const expectedChecksum = crypto.createHash('sha256').update(exactBytes).digest('hex');

      const res1 = await request(app)
        .post('/api/v1/cases/c1111111-1111-1111-1111-111111111111/documents/upload')
        .set('Cookie', iciciAuth.cookieHeader)
        .set('X-CSRF-Token', iciciAuth.csrfToken)
        .attach('file', exactBytes, 'First_Upload.pdf');

      const res2 = await request(app)
        .post('/api/v1/cases/c1111111-1111-1111-1111-111111111111/documents/upload')
        .set('Cookie', iciciAuth.cookieHeader)
        .set('X-CSRF-Token', iciciAuth.csrfToken)
        .attach('file', exactBytes, 'Second_Upload_Different_Name.pdf');

      expect(res1.body.data.checksum).toBe(expectedChecksum);
      expect(res2.body.data.checksum).toBe(expectedChecksum);
      expect(res1.body.data.checksum).toBe(res2.body.data.checksum);
    });

    it('produces distinct SHA-256 hash when byte payload is modified', async () => {
      const bytesA = Buffer.from('%PDF-1.4\n%Docket Version Alpha\n%%EOF');
      const bytesB = Buffer.from('%PDF-1.4\n%Docket Version Beta\n%%EOF');

      const resA = await request(app)
        .post('/api/v1/cases/c1111111-1111-1111-1111-111111111111/documents/upload')
        .set('Cookie', iciciAuth.cookieHeader)
        .set('X-CSRF-Token', iciciAuth.csrfToken)
        .attach('file', bytesA, 'Docket_A.pdf');

      const resB = await request(app)
        .post('/api/v1/cases/c1111111-1111-1111-1111-111111111111/documents/upload')
        .set('Cookie', iciciAuth.cookieHeader)
        .set('X-CSRF-Token', iciciAuth.csrfToken)
        .attach('file', bytesB, 'Docket_B.pdf');

      expect(resA.body.data.checksum).not.toBe(resB.body.data.checksum);
    });
  });

  describe('4. Centralized Rate Limiting & Endpoint Quotas', () => {
    it('enforces rate limiting on sensitive password reset requests', async () => {
      // 5 requests allowed in 300s window per IP
      let hitLimit = false;
      for (let i = 0; i < 7; i++) {
        const res = await request(app)
          .post('/api/v1/auth/password/reset/request')
          .send({ email: 'officer@bank.com' });
        if (res.status === 429) {
          hitLimit = true;
          expect(res.body.error.code).toBe('RATE_LIMITED');
          break;
        }
      }
      expect(hitLimit).toBe(true);
    });

    it('locks out account after 5 failed login attempts and prevents bypass', async () => {
      const targetAccount = 'lockout.target@panaceatest.com';

      // 5 consecutive failed attempts
      for (let i = 0; i < 5; i++) {
        await rateLimiter.recordFailedAttempt(targetAccount, '127.0.0.1', 'req-lockout-test');
      }

      // Check account lock status
      const status = await rateLimiter.checkAccountLock(targetAccount);
      expect(status.allowed).toBe(false);
      expect(status.remainingAttempts).toBe(0);
      expect(status.retryAfterSeconds).toBeGreaterThan(0);

      // Reset restores access
      await rateLimiter.resetAccount(targetAccount);
      const afterReset = await rateLimiter.checkAccountLock(targetAccount);
      expect(afterReset.allowed).toBe(true);
    });
  });

  describe('5. Production Configuration & Startup Validation', () => {
    it('validates production startup and rejects when DB or S3 is unconfigured', async () => {
      const report = await validateProductionStartup('production');
      expect(report.valid).toBe(false);
      expect(report.errors.length).toBeGreaterThan(0);

      // Verify specific production safety errors
      const errorText = report.errors.join(' ');
      expect(errorText).toContain('mandatory environment secret');
      expect(errorText).toContain('DATABASE_URL');
    });

    it('rejects in-memory storage in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      try {
        expect(() => new MemoryStorageService()).toThrow('strictly forbidden in production');
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });

    it('rejects mock malware scanner in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      try {
        expect(() => new MockMalwareScanner()).toThrow('strictly forbidden in production');
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });
  });

  describe('6. Hardened Health & Readiness Probes', () => {
    it('returns 200 with uptime on /health/live', async () => {
      const res = await request(app).get('/health/live');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ALIVE');
      expect(res.body.uptimeSeconds).toBeDefined();
    });

    it('returns 200 on /health/ready in dev/test environment', async () => {
      const res = await request(app).get('/health/ready');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('HEALTHY');
    });

    it('fails closed with 503 on /health/ready in production when database is uninitialized', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      try {
        const res = await request(app).get('/health/ready');
        expect(res.status).toBe(503);
        expect(res.body.status).toBe('UNHEALTHY');
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });
  });
});
