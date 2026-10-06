import request from 'supertest';
import crypto from 'crypto';
import { authenticator } from 'otplib';
import app from '../../src/main';
import { db } from '../../src/database/db';
import { TEST_CREDENTIALS } from '../../src/database/seed-data';
import { verifyAuditLogIntegrity } from '../../src/common/middleware/audit';

function extractSessionContext(res: request.Response) {
  const cookies: string[] = res.get('Set-Cookie') || [];
  let sessionCookie = '';
  let csrfCookie = '';
  let csrfToken = '';

  cookies.forEach((c) => {
    if (c.startsWith('panacea_session=')) {
      sessionCookie = c.split(';')[0];
    }
    if (c.startsWith('panacea_csrf=')) {
      csrfCookie = c.split(';')[0];
      csrfToken = csrfCookie.replace('panacea_csrf=', '');
    }
  });

  return {
    cookieHeader: [sessionCookie, csrfCookie].filter(Boolean).join('; '),
    sessionVerifier: sessionCookie.replace('panacea_session=', ''),
    csrfToken: csrfToken || res.body.data?.csrfToken || '',
  };
}

describe('PANACEA SECURITY SUITE — Remediation & Production Hardening Suite', () => {
  let iciciAuth: ReturnType<typeof extractSessionContext>;
  let axisAuth: ReturnType<typeof extractSessionContext>;
  let superAdminAuth: ReturnType<typeof extractSessionContext>;

  beforeAll(async () => {
    // 1. Authenticate ICICI Bank User
    const iciciLogin = await request(app).post('/api/v1/auth/login').send({
      email: TEST_CREDENTIALS.iciciAdmin.email,
      password: TEST_CREDENTIALS.iciciAdmin.password,
    });
    expect(iciciLogin.status).toBe(200);
    iciciAuth = extractSessionContext(iciciLogin);

    // 2. Authenticate Axis Bank User
    const axisLogin = await request(app).post('/api/v1/auth/login').send({
      email: TEST_CREDENTIALS.axisUser.email,
      password: TEST_CREDENTIALS.axisUser.password,
    });
    expect(axisLogin.status).toBe(200);
    axisAuth = extractSessionContext(axisLogin);

    // 3. Authenticate Super Admin (Password + Cryptographic TOTP)
    const adminInit = await request(app).post('/api/v1/auth/login').send({
      email: TEST_CREDENTIALS.superAdmin.email,
      password: TEST_CREDENTIALS.superAdmin.password,
    });
    expect(adminInit.status).toBe(200);
    expect(adminInit.body.data.mfaRequired).toBe(true);

    const adminTotp = authenticator.generate(TEST_CREDENTIALS.superAdmin.totpSecret);
    const adminLogin = await request(app).post('/api/v1/auth/login').send({
      email: TEST_CREDENTIALS.superAdmin.email,
      password: TEST_CREDENTIALS.superAdmin.password,
      mfaCode: adminTotp,
    });
    expect(adminLogin.status).toBe(200);
    superAdminAuth = extractSessionContext(adminLogin);
  });

  describe('1. Elimination of Universal Passwords & Authentication Shortcuts (P0)', () => {
    it('MUST REJECT universal/demo password "PanaceaSecure2026!#" with 401', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: TEST_CREDENTIALS.iciciAdmin.email,
        password: 'PanaceaSecure2026!#',
      });
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('rejects incorrect user passwords with standard 401 envelope', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: TEST_CREDENTIALS.axisUser.email,
        password: 'WrongPasswordCandidate!123',
      });
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('rejects authentication with missing credentials', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({});
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('neutralizes user enumeration: non-existent email returns same 401 response', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'nonexistent.officer@bank.com',
        password: 'RandomPassword#2026',
      });
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
      expect(res.body.error.message).toBe('Invalid credentials.');
    });
  });

  describe('2. Elimination of MFA Bypass & Mandatory Privileged MFA Policy (P0/P1)', () => {
    it('MUST REJECT magic dev bypass code "123456" for privileged user MFA challenges', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: TEST_CREDENTIALS.superAdmin.email,
        password: TEST_CREDENTIALS.superAdmin.password,
        mfaCode: '123456',
      });
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('demands MFA challenge for privileged accounts without granting active session', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: TEST_CREDENTIALS.superAdmin.email,
        password: TEST_CREDENTIALS.superAdmin.password,
      });
      expect(res.status).toBe(200);
      expect(res.body.data.mfaRequired).toBe(true);
      expect(res.body.data.user).toBeUndefined(); // Session not created yet
    });

    it('accepts authentic cryptographically calculated TOTP tokens', async () => {
      const validTotp = authenticator.generate(TEST_CREDENTIALS.superAdmin.totpSecret);
      const res = await request(app).post('/api/v1/auth/login').send({
        email: TEST_CREDENTIALS.superAdmin.email,
        password: TEST_CREDENTIALS.superAdmin.password,
        mfaCode: validTotp,
      });
      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe(TEST_CREDENTIALS.superAdmin.email);
    });
  });

  describe('3. Session Security, Hashed Verifiers & LocalStorage Token Elimination (P0)', () => {
    it('does NOT expose raw session secret or token in the login response payload', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: TEST_CREDENTIALS.axisUser.email,
        password: TEST_CREDENTIALS.axisUser.password,
      });
      expect(res.status).toBe(200);
      expect(res.body.data.session).toBeDefined();
      expect(res.body.data.session.token).toBeUndefined(); // Eliminated from payload
      expect(res.body.data.session.id).toBeDefined();
    });

    it('stores SHA-256 verifier hash in database, never plaintext session secret', async () => {
      const auth = axisAuth;
      expect(auth.sessionVerifier).toBeDefined();
      expect(auth.sessionVerifier.length).toBe(64); // 32-byte hex

      // Compute expected hash
      const expectedHash = crypto.createHash('sha256').update(auth.sessionVerifier).digest('hex');

      // Database should contain the hash, NOT the raw verifier
      const matchingInDb = db.sessions.find((s) => s.session_hash === expectedHash);
      expect(matchingInDb).toBeDefined();

      const rawMatch = db.sessions.find((s) => s.session_hash === auth.sessionVerifier);
      expect(rawMatch).toBeUndefined(); // Raw verifier MUST NOT exist in DB
    });

    it('sets secure HttpOnly and strict cookie headers on authentication', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: TEST_CREDENTIALS.axisUser.email,
        password: TEST_CREDENTIALS.axisUser.password,
      });
      const cookieHeader = res.get('Set-Cookie')?.join('; ') || '';
      expect(cookieHeader).toContain('panacea_session=');
      expect(cookieHeader).toContain('HttpOnly');
      expect(cookieHeader).toContain('SameSite=Strict');
    });

    it('server-side session revocation: logout invalidates session in DB and rejects future requests', async () => {
      // 1. Create a temporary session
      const loginRes = await request(app).post('/api/v1/auth/login').send({
        email: TEST_CREDENTIALS.axisUser.email,
        password: TEST_CREDENTIALS.axisUser.password,
      });
      const tempAuth = extractSessionContext(loginRes);

      // 2. Verify temporary session works
      const testReq = await request(app)
        .get('/api/v1/cases')
        .set('Cookie', tempAuth.cookieHeader);
      expect(testReq.status).toBe(200);

      // 3. Logout
      const logoutRes = await request(app)
        .post('/api/v1/auth/logout')
        .set('Cookie', tempAuth.cookieHeader)
        .set('X-CSRF-Token', tempAuth.csrfToken);
      expect(logoutRes.status).toBe(200);

      // 4. Verify subsequent request with same cookie fails with 401
      const postLogoutReq = await request(app)
        .get('/api/v1/cases')
        .set('Cookie', tempAuth.cookieHeader);
      expect(postLogoutReq.status).toBe(401);
      expect(postLogoutReq.body.error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('4. Centralized Brute-Force Rate Limiting (P1)', () => {
    it('locks out account after 5 consecutive failed login attempts with 429', async () => {
      const victimEmail = 'test.lockout.target@panaceaconsultancy.in';

      // 5 failed attempts
      for (let i = 0; i < 5; i++) {
        await request(app).post('/api/v1/auth/login').send({
          email: victimEmail,
          password: 'IncorrectAttempt#999',
        });
      }

      // 6th attempt must be rejected with 429 ACCOUNT_LOCKED
      const lockoutRes = await request(app).post('/api/v1/auth/login').send({
        email: victimEmail,
        password: 'IncorrectAttempt#999',
      });
      expect(lockoutRes.status).toBe(429);
      expect(lockoutRes.body.error.code).toBe('ACCOUNT_LOCKED');
    });
  });

  describe('5. CSRF Protection for State-Changing Operations (P1)', () => {
    it('rejects mutating POST requests with browser session cookie but missing CSRF header', async () => {
      const res = await request(app)
        .post('/api/v1/cases')
        .set('Cookie', iciciAuth.cookieHeader)
        .send({ title: 'CSRF Exploit Attempt' });

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('CSRF_VALIDATION_FAILED');
    });

    it('permits mutating request when matching X-CSRF-Token header is provided', async () => {
      const res = await request(app)
        .post('/api/v1/cases')
        .set('Cookie', iciciAuth.cookieHeader)
        .set('X-CSRF-Token', iciciAuth.csrfToken)
        .send({ title: 'Legitimate Authorized Case Docket' });

      expect(res.status).toBe(201);
      expect(res.body.data.id).toBeDefined();
    });
  });

  describe('6. Real Document Upload, Actual-Byte Checksum & Magic Bytes (P0)', () => {
    it('calculates SHA-256 checksum from ACTUAL uploaded binary bytes', async () => {
      const pdfContent = Buffer.from('%PDF-1.4\n%Real Binary Upload Test Docket Content\n%%EOF');
      const expectedChecksum = crypto.createHash('sha256').update(pdfContent).digest('hex');

      const res = await request(app)
        .post('/api/v1/cases/c1111111-1111-1111-1111-111111111111/documents/upload')
        .set('Cookie', iciciAuth.cookieHeader)
        .set('X-CSRF-Token', iciciAuth.csrfToken)
        .attach('file', pdfContent, 'DM_Certified_Real_Bytes.pdf');

      expect(res.status).toBe(201);
      expect(res.body.data.checksum).toBe(expectedChecksum);
      expect(res.body.data.originalFilename).toBe('DM_Certified_Real_Bytes.pdf');
    });

    it('rejects files with spoofed MIME types failing magic bytes validation', async () => {
      // Executable shell script renamed with .pdf extension
      const maliciousScript = Buffer.from('#!/bin/bash\necho "Malicious payload"\n');

      const res = await request(app)
        .post('/api/v1/cases/c1111111-1111-1111-1111-111111111111/documents/upload')
        .set('Cookie', iciciAuth.cookieHeader)
        .set('X-CSRF-Token', iciciAuth.csrfToken)
        .attach('file', maliciousScript, {
          filename: 'exploit.pdf',
          contentType: 'application/pdf',
        });

      expect(res.status).toBe(415);
      expect(res.body.error.code).toBe('DISALLOWED_FILE_TYPE');
    });

    it('sanitizes malicious path traversal filenames', async () => {
      const pdfContent = Buffer.from('%PDF-1.4\n%Traversal test\n%%EOF');
      const res = await request(app)
        .post('/api/v1/cases/c1111111-1111-1111-1111-111111111111/documents/upload')
        .set('Cookie', iciciAuth.cookieHeader)
        .set('X-CSRF-Token', iciciAuth.csrfToken)
        .attach('file', pdfContent, '../../../etc/passwd.pdf');

      expect(res.status).toBe(201);
      expect(res.body.data.originalFilename).not.toContain('../');
    });

    it('never leaks internal storage keys or vault paths to the client', async () => {
      const res = await request(app)
        .get('/api/v1/cases/c1111111-1111-1111-1111-111111111111/documents')
        .set('Cookie', iciciAuth.cookieHeader);

      expect(res.status).toBe(200);
      res.body.data.forEach((d: any) => {
        expect(d.storage_key).toBeUndefined();
        expect(d.storageKey).toBeUndefined();
      });
    });
  });

  describe('7. Secure Document Download, Ephemeral Grants & Binary Streaming (P0)', () => {
    let testDocId: string;

    beforeAll(async () => {
      const pdfContent = Buffer.from('%PDF-1.4\n%Download test docket bytes\n%%EOF');
      const uploadRes = await request(app)
        .post('/api/v1/cases/c1111111-1111-1111-1111-111111111111/documents/upload')
        .set('Cookie', iciciAuth.cookieHeader)
        .set('X-CSRF-Token', iciciAuth.csrfToken)
        .attach('file', pdfContent, 'Download_Stream_Target.pdf');
      testDocId = uploadRes.body.data.id;
    });

    it('generates short-lived download grant with signed URL', async () => {
      const res = await request(app)
        .post(`/api/v1/documents/${testDocId}/download`)
        .set('Cookie', iciciAuth.cookieHeader)
        .set('X-CSRF-Token', iciciAuth.csrfToken);

      expect(res.status).toBe(200);
      expect(res.body.data.downloadUrl).toContain('/stream?grant=');
      expect(res.body.data.expiresAt).toBeDefined();
    });

    it('streams actual binary bytes with valid download grant', async () => {
      // 1. Obtain grant
      const grantRes = await request(app)
        .post(`/api/v1/documents/${testDocId}/download`)
        .set('Cookie', iciciAuth.cookieHeader)
        .set('X-CSRF-Token', iciciAuth.csrfToken);

      const downloadUrl = grantRes.body.data.downloadUrl;
      const grantToken = new URL(`http://localhost${downloadUrl}`).searchParams.get('grant');

      // 2. Stream file
      const streamRes = await request(app).get(`/api/v1/documents/${testDocId}/stream?grant=${grantToken}`);

      expect(streamRes.status).toBe(200);
      expect(streamRes.headers['content-type']).toContain('application/pdf');
      expect(streamRes.headers['x-content-type-options']).toBe('nosniff');
      expect(streamRes.body.length).toBeGreaterThan(0);
    });

    it('rejects reuse of single-use download grants with 403', async () => {
      // 1. Obtain grant
      const grantRes = await request(app)
        .post(`/api/v1/documents/${testDocId}/download`)
        .set('Cookie', iciciAuth.cookieHeader)
        .set('X-CSRF-Token', iciciAuth.csrfToken);

      const grantToken = new URL(`http://localhost${grantRes.body.data.downloadUrl}`).searchParams.get('grant');

      // 2. First download succeeds
      const firstStream = await request(app).get(`/api/v1/documents/${testDocId}/stream?grant=${grantToken}`);
      expect(firstStream.status).toBe(200);

      // 3. Second download with identical grant MUST FAIL (single use)
      const secondStream = await request(app).get(`/api/v1/documents/${testDocId}/stream?grant=${grantToken}`);
      expect(secondStream.status).toBe(403);
    });

    it('forbids cross-tenant document download requests (Axis user accessing ICICI document)', async () => {
      const res = await request(app)
        .post(`/api/v1/documents/${testDocId}/download`)
        .set('Cookie', axisAuth.cookieHeader)
        .set('X-CSRF-Token', axisAuth.csrfToken);

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });
  });

  describe('8. Multi-Tenant Isolation & BOLA/IDOR Prevention (P0/P1)', () => {
    it('scopes case docket query strictly to authenticated tenant', async () => {
      const res = await request(app)
        .get('/api/v1/cases')
        .set('Cookie', iciciAuth.cookieHeader);

      expect(res.status).toBe(200);
      res.body.data.items.forEach((c: any) => {
        expect(c.organization_id).toBe('22222222-2222-2222-2222-222222222222');
      });
    });

    it('returns 404 for cross-tenant case docket access to prevent enumeration', async () => {
      // Axis case ID: c4444444-4444-4444-4444-444444444444
      const res = await request(app)
        .get('/api/v1/cases/c4444444-4444-4444-4444-444444444444')
        .set('Cookie', iciciAuth.cookieHeader);

      expect(res.status).toBe(404);
    });
  });

  describe('9. Auditable Administrative Operations & RBAC (P1)', () => {
    it('prevents non-admin client users from accessing audit logs', async () => {
      const res = await request(app)
        .get('/api/v1/admin/audit-logs')
        .set('Cookie', iciciAuth.cookieHeader);

      expect(res.status).toBe(403);
    });

    it('logs super-admin privileged actions to audit trail', async () => {
      const initialLogsCount = db.auditLogs.length;

      const res = await request(app)
        .get('/api/v1/admin/audit-logs')
        .set('Cookie', superAdminAuth.cookieHeader);

      expect(res.status).toBe(200);
      expect(db.auditLogs.length).toBeGreaterThan(initialLogsCount);

      // Verify audit record was captured
      const latestLog = db.auditLogs[0];
      expect(latestLog.event_type).toBe('SUPER_ADMIN_PRIVILEGED_OPERATION');
      expect(latestLog.actor_user_id).toBe('u1111111-3333-3333-3333-111111111111');
    });
  });

  describe('10. Cryptographic Audit Trail Hash Chaining & Tamper Detection (P2)', () => {
    it('verifies that the entire audit log chain maintains valid cryptographic linkage', () => {
      const verification = verifyAuditLogIntegrity(db.auditLogs);
      expect(verification.valid).toBe(true);
    });

    it('detects tampering when any historical audit log payload is modified', () => {
      // Create a copy of current logs
      const clonedLogs = JSON.parse(JSON.stringify(db.auditLogs));
      expect(clonedLogs.length).toBeGreaterThan(1);

      // Tamper with a middle record
      const targetIndex = Math.floor(clonedLogs.length / 2);
      clonedLogs[targetIndex].action = 'MALICIOUS_TAMPERED_ACTION';

      const verification = verifyAuditLogIntegrity(clonedLogs);
      expect(verification.valid).toBe(false);
      expect(verification.reason).toContain('Hash mismatch');
    });
  });

  describe('11. Database Fail-Closed Policy (P0)', () => {
    it('fails closed when database is offline in production mode', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      try {
        const res = await request(app).get('/health');
        expect(res.status).toBe(503);
        expect(res.body.status).toBe('UNHEALTHY');
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });
  });

  describe('12. Advanced Authorization & Session Lifecycle Enforcement (P1)', () => {
    it('rejects expired sessions with 401 UNAUTHORIZED', async () => {
      // Create expired session record directly in database
      const expiredVerifier = crypto.randomBytes(32).toString('hex');
      const expiredHash = crypto.createHash('sha256').update(expiredVerifier).digest('hex');

      db.sessions.push({
        id: 'expired-session-uuid',
        user_id: TEST_CREDENTIALS.axisUser.email,
        session_hash: expiredHash,
        device_metadata: { userAgent: 'Test', ip: '127.0.0.1' },
        created_at: new Date(Date.now() - 3600000).toISOString(),
        expires_at: new Date(Date.now() - 1800000).toISOString(), // Expired 30 min ago
        revoked_at: null,
        last_seen_at: new Date(Date.now() - 1800000).toISOString(),
      });

      const res = await request(app)
        .get('/api/v1/cases')
        .set('Cookie', `panacea_session=${expiredVerifier}`);

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('rejects malformed session cookies with 401 UNAUTHORIZED', async () => {
      const res = await request(app)
        .get('/api/v1/cases')
        .set('Cookie', 'panacea_session=malformed-short-token');

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('prevents non-admin client users from disabling accounts (Privilege Escalation)', async () => {
      const res = await request(app)
        .post('/api/v1/admin/users/u5555555-5555-5555-5555-555555555555/disable')
        .set('Cookie', iciciAuth.cookieHeader)
        .set('X-CSRF-Token', iciciAuth.csrfToken);

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('prevents non-admin client users from creating new users (Privilege Escalation)', async () => {
      const res = await request(app)
        .post('/api/v1/admin/users')
        .set('Cookie', iciciAuth.cookieHeader)
        .set('X-CSRF-Token', iciciAuth.csrfToken)
        .send({
          email: 'attacker@evil.com',
          displayName: 'Attacker User',
          roleName: 'platform_super_admin',
        });

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('rejects file uploads exceeding 50MB size limit with 413', async () => {
      const res = await request(app)
        .post('/api/v1/cases/c1111111-1111-1111-1111-111111111111/documents/upload')
        .set('Cookie', iciciAuth.cookieHeader)
        .set('X-CSRF-Token', iciciAuth.csrfToken)
        .send({
          filename: 'huge_document.pdf',
          mimeType: 'application/pdf',
          sizeBytes: 60 * 1024 * 1024, // 60MB
        });

      expect(res.status).toBe(413);
      expect(res.body.error.code).toBe('FILE_TOO_LARGE');
    });

    it('rejects disallowed executable file extensions with 415', async () => {
      const res = await request(app)
        .post('/api/v1/cases/c1111111-1111-1111-1111-111111111111/documents/upload')
        .set('Cookie', iciciAuth.cookieHeader)
        .set('X-CSRF-Token', iciciAuth.csrfToken)
        .send({
          filename: 'payload.exe',
          mimeType: 'application/x-msdownload',
          sizeBytes: 1024,
        });

      expect(res.status).toBe(415);
      expect(res.body.error.code).toBe('DISALLOWED_FILE_TYPE');
    });
  });
});
