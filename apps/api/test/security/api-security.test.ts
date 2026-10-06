import request from 'supertest';
import app from '../../src/main';

describe('PANACEA SECURITY SUITE — API Authorization & Security Hardening', () => {
  let iciciUserToken: string;
  let axisUserToken: string;
  let superAdminToken: string;

  beforeAll(async () => {
    // 1. Authenticate ICICI User
    const iciciLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nodal.officer@icicibank.com', password: 'PanaceaSecure2026!#' });
    expect(iciciLogin.status).toBe(200);
    iciciUserToken = iciciLogin.body.data.session.token;

    // 2. Authenticate Axis User
    const axisLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'recovery.desk@axisbank.com', password: 'PanaceaSecure2026!#' });
    expect(axisLogin.status).toBe(200);
    axisUserToken = axisLogin.body.data.session.token;

    // 3. Authenticate Super Admin
    const adminLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@panaceaconsultancy.in', password: 'PanaceaSecure2026!#' });
    expect(adminLogin.status).toBe(200);
    superAdminToken = adminLogin.body.data.session.token;
  });

  describe('1. Authentication & Session Verification', () => {
    it('rejects unauthenticated requests to protected endpoints with 401', async () => {
      const res = await request(app).get('/api/v1/cases');
      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
      expect(res.body.error.code).toBe('UNAUTHORIZED');
      expect(res.body.error.requestId).toBeDefined();
    });

    it('rejects invalid or forged session tokens with 401', async () => {
      const res = await request(app)
        .get('/api/v1/cases')
        .set('Authorization', 'Bearer forged-invalid-token-12345');
      expect(res.status).toBe(401);
    });

    it('returns standard error envelope without leaking stack traces', async () => {
      const res = await request(app).get('/api/v1/non-existent-endpoint-route');
      expect(res.status).toBe(404);
      expect(res.body.error).toBeDefined();
      expect(res.body.error.code).toBe('ROUTE_NOT_FOUND');
      expect(res.body.stack).toBeUndefined();
    });
  });

  describe('2. Multi-Tenant Isolation & BOLA/IDOR Prevention', () => {
    it('scopes case list to the authenticated organization', async () => {
      const res = await request(app)
        .get('/api/v1/cases')
        .set('Authorization', `Bearer ${iciciUserToken}`);

      expect(res.status).toBe(200);
      const items = res.body.data.items;
      // All items must belong to ICICI Bank organization
      items.forEach((c: any) => {
        expect(c.organization_id).toBe('22222222-2222-2222-2222-222222222222');
      });
    });

    it('strictly forbids a client organization from accessing another organizations case docket (BOLA)', async () => {
      // Axis case ID: c4444444-4444-4444-4444-444444444444
      const res = await request(app)
        .get('/api/v1/cases/c4444444-4444-4444-4444-444444444444')
        .set('Authorization', `Bearer ${iciciUserToken}`);

      // Must be 404 (to prevent tenant resource enumeration)
      expect(res.status).toBe(404);
    });

    it('allows authorized Panacea admin staff cross-tenant oversight', async () => {
      // Super admin accesses Axis case
      const res = await request(app)
        .get('/api/v1/cases/c4444444-4444-4444-4444-444444444444')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('c4444444-4444-4444-4444-444444444444');
    });
  });

  describe('3. Case State Machine Transitions', () => {
    it('prevents illegal status skip from intake to possession_taken', async () => {
      // Create new intake case
      const createRes = await request(app)
        .post('/api/v1/cases')
        .set('Authorization', `Bearer ${iciciUserToken}`)
        .send({ title: 'Illegal Transition Test Docket' });

      expect(createRes.status).toBe(201);
      const caseId = createRes.body.data.id;

      // Attempt illegal jump
      const badTransition = await request(app)
        .post(`/api/v1/cases/${caseId}/status`)
        .set('Authorization', `Bearer ${iciciUserToken}`)
        .send({ newStatus: 'possession_taken', reason: 'Attempted jump' });

      expect(badTransition.status).toBe(400);
      expect(badTransition.body.error.code).toBe('INVALID_STATUS_TRANSITION');
    });

    it('permits authorized sequential status advance', async () => {
      const createRes = await request(app)
        .post('/api/v1/cases')
        .set('Authorization', `Bearer ${iciciUserToken}`)
        .send({ title: 'Valid Transition Docket' });

      const caseId = createRes.body.data.id;

      // Advance intake -> notice_drafting
      const validTransition = await request(app)
        .post(`/api/v1/cases/${caseId}/status`)
        .set('Authorization', `Bearer ${iciciUserToken}`)
        .send({ newStatus: 'notice_drafting', reason: 'Drafting demand notice u/s 13(2)' });

      expect(validTransition.status).toBe(200);
      expect(validTransition.body.data.case.status).toBe('notice_drafting');
    });
  });

  describe('4. File Upload & Document Security', () => {
    it('rejects disallowed executable file types (MIME check)', async () => {
      const res = await request(app)
        .post('/api/v1/cases/c1111111-1111-1111-1111-111111111111/documents/upload')
        .set('Authorization', `Bearer ${iciciUserToken}`)
        .send({
          filename: 'exploit.sh',
          mimeType: 'application/x-sh',
          sizeBytes: 1024,
        });

      expect(res.status).toBe(415);
      expect(res.body.error.code).toBe('DISALLOWED_FILE_TYPE');
    });

    it('rejects files exceeding 50MB size limit', async () => {
      const res = await request(app)
        .post('/api/v1/cases/c1111111-1111-1111-1111-111111111111/documents/upload')
        .set('Authorization', `Bearer ${iciciUserToken}`)
        .send({
          filename: 'oversized_scan.pdf',
          mimeType: 'application/pdf',
          sizeBytes: 60 * 1024 * 1024, // 60MB
        });

      expect(res.status).toBe(413);
      expect(res.body.error.code).toBe('FILE_TOO_LARGE');
    });

    it('sanitizes malicious path traversal filenames', async () => {
      const res = await request(app)
        .post('/api/v1/cases/c1111111-1111-1111-1111-111111111111/documents/upload')
        .set('Authorization', `Bearer ${iciciUserToken}`)
        .send({
          filename: '../../../etc/passwd.pdf',
          mimeType: 'application/pdf',
          sizeBytes: 2048,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.originalFilename).not.toContain('../');
    });

    it('never exposes private storage_key to the client', async () => {
      const res = await request(app)
        .get('/api/v1/cases/c1111111-1111-1111-1111-111111111111/documents')
        .set('Authorization', `Bearer ${iciciUserToken}`);

      expect(res.status).toBe(200);
      const docs = res.body.data;
      docs.forEach((doc: any) => {
        expect(doc.storage_key).toBeUndefined();
        expect(doc.storageKey).toBeUndefined();
      });
    });

    it('forbids cross-tenant document download requests', async () => {
      // Axis user attempts to download ICICI document: d1111111-1111-1111-1111-111111111111
      const res = await request(app)
        .post('/api/v1/documents/d1111111-1111-1111-1111-111111111111/download')
        .set('Authorization', `Bearer ${axisUserToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });
  });

  describe('5. RBAC & Privilege Escalation', () => {
    it('prevents non-admin client users from accessing audit logs', async () => {
      const res = await request(app)
        .get('/api/v1/admin/audit-logs')
        .set('Authorization', `Bearer ${iciciUserToken}`);

      expect(res.status).toBe(403);
    });

    it('prevents non-admin client users from disabling accounts', async () => {
      const res = await request(app)
        .post('/api/v1/admin/users/u5555555-5555-5555-5555-555555555555/disable')
        .set('Authorization', `Bearer ${iciciUserToken}`);

      expect(res.status).toBe(403);
    });

    it('allows super admin to access audit logs and security monitoring', async () => {
      const res = await request(app)
        .get('/api/v1/admin/audit-logs')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.items).toBeDefined();
    });
  });
});
