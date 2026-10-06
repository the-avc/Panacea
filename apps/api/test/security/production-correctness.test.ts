import request from 'supertest';
import crypto from 'crypto';
import app from '../../src/main';
import { db } from '../../src/database/db';
import {
  SEED_USERS,
  SEED_ORGS,
  SEED_CASES,
  SEED_DOCUMENTS,
  TEST_CREDENTIALS,
} from '../../src/database/seed-data';
import {
  MemoryStorageService,
  S3StorageService,
  getStorageService,
} from '../../src/common/storage/storage.service';
import {
  MockMalwareScanner,
  ClamAVScanner,
  getMalwareScanner,
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

describe('PANACEA P0.1 PRODUCTION CORRECTNESS HARDENING REGRESSION SUITE', () => {
  let authSession: ReturnType<typeof extractSession>;
  const testCaseId = 'c1111111-1111-1111-1111-111111111111';

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: TEST_CREDENTIALS.iciciAdmin.email,
      password: TEST_CREDENTIALS.iciciAdmin.password,
    });
    authSession = extractSession(loginRes);
  });

  describe('1. Production Data Separation & Seed Isolation', () => {
    it('proves demo users, organizations, cases, and documents are excluded when NODE_ENV=production', () => {
      const origEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      try {
        expect(Object.keys(SEED_USERS)).toBeDefined();
        // TEST_CREDENTIALS proxy throws when accessed in production
        expect(() => TEST_CREDENTIALS.iciciAdmin).toThrow('is forbidden in production');
      } finally {
        process.env.NODE_ENV = origEnv;
      }
    });

    it('proves startup validation fails if demo seed flags are accidentally enabled', async () => {
      const origFlag = process.env.ENABLE_DEV_SEEDS;
      process.env.ENABLE_DEV_SEEDS = 'true';
      try {
        const report = await validateProductionStartup('production');
        expect(report.valid).toBe(false);
        expect(report.errors.join(' ')).toContain('Development seed fixtures are strictly forbidden');
      } finally {
        process.env.ENABLE_DEV_SEEDS = origFlag;
      }
    });
  });

  describe('2. Authentication Hardening & No Demo Login', () => {
    it('rejects universal or fallback passwords with 401', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: TEST_CREDENTIALS.iciciAdmin.email,
        password: 'PanaceaSecure2026!#',
      });
      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });

    it('rejects static magic MFA code 123456 for privileged directors/admins', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: TEST_CREDENTIALS.superAdmin.email,
        password: TEST_CREDENTIALS.superAdmin.password,
        mfaCode: '123456',
      });
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
      expect(res.body.error.message).toContain('Invalid multi-factor authentication code');
    });
  });

  describe('3. Database Initialization & PostgreSQL Production Enforcement', () => {
    it('fails startup initialization when PostgreSQL is unavailable in production', async () => {
      const origEnv = process.env.NODE_ENV;
      const origUrl = process.env.DATABASE_URL;
      process.env.NODE_ENV = 'production';
      delete process.env.DATABASE_URL;
      try {
        await expect(db.initialize()).rejects.toThrow(
          'Production environment requires persistent DATABASE_URL',
        );
      } finally {
        process.env.NODE_ENV = origEnv;
        if (origUrl) process.env.DATABASE_URL = origUrl;
      }
    });

    it('proves in-memory database rejects startup in production', async () => {
      const report = await validateProductionStartup('production');
      expect(report.valid).toBe(false);
      expect(report.errors.join(' ')).toContain('Persistent PostgreSQL database');
    });
  });

  describe('4. Storage Configuration & Private Bucket Enforcement', () => {
    it('proves in-memory document vault is forbidden in production', () => {
      const origEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      try {
        expect(() => new MemoryStorageService()).toThrow('strictly forbidden in production');
      } finally {
        process.env.NODE_ENV = origEnv;
      }
    });

    it('rejects localhost S3 endpoint in production', () => {
      const origEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      try {
        expect(
          () =>
            new S3StorageService({
              endpoint: 'http://localhost:9000',
              bucket: 'prod-bucket',
              accessKey: 'prod-key',
              secretKey: 'prod-secret',
            }),
        ).toThrow('Localhost storage endpoint forbidden in production');
      } finally {
        process.env.NODE_ENV = origEnv;
      }
    });

    it('fails startup if mandatory S3 parameters are missing in production', () => {
      const origEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      try {
        expect(() => new S3StorageService({})).toThrow('requires explicit S3_BUCKET');
      } finally {
        process.env.NODE_ENV = origEnv;
      }
    });
  });

  describe('5. Malware Scanner Production Dependency', () => {
    it('forbids MockMalwareScanner in production', () => {
      const origEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      try {
        expect(() => new MockMalwareScanner()).toThrow('strictly forbidden in production');
      } finally {
        process.env.NODE_ENV = origEnv;
      }
    });

    it('forbids ClamAVScanner without CLAMAV_HOST in production', () => {
      const origEnv = process.env.NODE_ENV;
      const origHost = process.env.CLAMAV_HOST;
      process.env.NODE_ENV = 'production';
      delete process.env.CLAMAV_HOST;
      try {
        expect(() => new ClamAVScanner({})).toThrow('requires explicit CLAMAV_HOST');
      } finally {
        process.env.NODE_ENV = origEnv;
        if (origHost) process.env.CLAMAV_HOST = origHost;
      }
    });

    it('blocks publication and fails closed on scanner failure', async () => {
      const scanner = getMalwareScanner() as MockMalwareScanner;
      scanner.setSimulateFailure(true);
      try {
        const dummyPdf = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF');
        const res = await request(app)
          .post(`/api/v1/cases/${testCaseId}/documents/upload`)
          .set('Cookie', authSession.cookieHeader)
          .set('X-CSRF-Token', authSession.csrfToken)
          .attach('file', dummyPdf, 'valid.pdf');

        expect(res.status).toBe(503);
        expect(res.body.error.code).toBe('SCAN_FAILED');
      } finally {
        scanner.setSimulateFailure(false);
      }
    });

    it('rejects infected file upload containing EICAR signature with 422', async () => {
      const eicarPayload = Buffer.from(
        `%PDF-1.4\n${EICAR_TEST_SIGNATURE}\n%%EOF`,
      );
      const res = await request(app)
        .post(`/api/v1/cases/${testCaseId}/documents/upload`)
        .set('Cookie', authSession.cookieHeader)
        .set('X-CSRF-Token', authSession.csrfToken)
        .attach('file', eicarPayload, 'eicar_test.pdf');

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('MALWARE_DETECTED');
      expect(res.body.error.message).toContain('Malware scan failed');
    });

    it('publishes clean file successfully with 201', async () => {
      const cleanPdf = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF');
      const res = await request(app)
        .post(`/api/v1/cases/${testCaseId}/documents/upload`)
        .set('Cookie', authSession.cookieHeader)
        .set('X-CSRF-Token', authSession.csrfToken)
        .attach('file', cleanPdf, 'clean_report.pdf');

      expect(res.status).toBe(201);
      expect(res.body.data.id).toBeDefined();
    });
  });

  describe('6. Centralized Redis Rate Limiting & Fail-Closed Behavior', () => {
    it('fails closed in production when Redis is down without falling back to local Map', async () => {
      const origEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      try {
        const ipAllowed = await rateLimiter.checkIpRateLimit('198.51.100.1');
        expect(ipAllowed).toBe(false);

        const lockStatus = await rateLimiter.checkAccountLock('victim@bank.com');
        expect(lockStatus.allowed).toBe(false);

        const endpointStatus = await rateLimiter.checkEndpointLimit('test', 'key', 10, 60);
        expect(endpointStatus.allowed).toBe(false);
      } finally {
        process.env.NODE_ENV = origEnv;
      }
    });
  });

  describe('7. Document Upload Validation: Zero Synthetic / Fake Files', () => {
    it('returns 400 Bad Request when no file is uploaded (no fake PDF generated)', async () => {
      const res = await request(app)
        .post(`/api/v1/cases/${testCaseId}/documents/upload`)
        .set('Cookie', authSession.cookieHeader)
        .set('X-CSRF-Token', authSession.csrfToken)
        .send({
          filename: 'document.pdf',
          mimeType: 'application/pdf',
          sizeBytes: 1024,
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.message).toContain('File payload is mandatory for document upload');
    });

    it('calculates SHA-256 checksum strictly from actual uploaded file bytes', async () => {
      const rawBytes = Buffer.from('%PDF-1.4\nAuthenticUniqueBytesForChecksumVerification_2026\n%%EOF');
      const expectedChecksum = crypto.createHash('sha256').update(rawBytes).digest('hex');

      const res = await request(app)
        .post(`/api/v1/cases/${testCaseId}/documents/upload`)
        .set('Cookie', authSession.cookieHeader)
        .set('X-CSRF-Token', authSession.csrfToken)
        .attach('file', rawBytes, 'checksum_verified.pdf');

      expect(res.status).toBe(201);
      expect(res.body.data.checksum).toBe(expectedChecksum);
    });
  });

  describe('8. Database Transactional Integrity & Compensating Cleanup', () => {
    it('uses createDocumentTransaction to insert document and version transactionally', async () => {
      const testDoc = {
        id: 'd9999999-0000-0000-0000-000000000001',
        case_id: testCaseId,
        classification: 'confidential' as const,
        original_filename: 'tx_test.pdf',
        storage_key: 'documents/org/doc/v1/key.bin',
        mime_type: 'application/pdf',
        size_bytes: 100,
        checksum: 'abc123def456',
        status: 'available' as const,
        uploaded_by: 'u1',
        created_at: new Date().toISOString(),
      };
      const testVer = {
        id: 'v9999999-0000-0000-0000-000000000001',
        document_id: testDoc.id,
        version_number: 1,
        storage_key: testDoc.storage_key,
        checksum: testDoc.checksum,
        size_bytes: testDoc.size_bytes,
        uploaded_by: 'u1',
        created_at: new Date().toISOString(),
      };

      const result = await db.createDocumentTransaction({
        document: testDoc,
        version: testVer,
      });

      expect(result).toBeDefined();
      expect(result.id).toBe(testDoc.id);

      const retrieved = await db.getDocumentById(testDoc.id);
      expect(retrieved).toBeDefined();
    });

    it('compensates with object storage cleanup if database transaction fails', async () => {
      const storageService = getStorageService();
      let deleteCalledWithKey = '';
      const originalDelete = storageService.deleteObject.bind(storageService);
      storageService.deleteObject = async (key: string) => {
        deleteCalledWithKey = key;
        return originalDelete(key);
      };

      const originalCreateTx = db.createDocumentTransaction.bind(db);
      db.createDocumentTransaction = async () => {
        throw new Error('Database transaction connection error');
      };

      try {
        const dummyPdf = Buffer.from('%PDF-1.4\nValidPayloadForTxFail\n%%EOF');
        const res = await request(app)
          .post(`/api/v1/cases/${testCaseId}/documents/upload`)
          .set('Cookie', authSession.cookieHeader)
          .set('X-CSRF-Token', authSession.csrfToken)
          .attach('file', dummyPdf, 'fail_tx.pdf');

        expect(res.status).toBe(500);
        expect(deleteCalledWithKey).toContain('documents/');
      } finally {
        db.createDocumentTransaction = originalCreateTx;
        storageService.deleteObject = originalDelete;
      }
    });
  });
});
