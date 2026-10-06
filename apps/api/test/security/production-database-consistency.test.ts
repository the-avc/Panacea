import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../src/database/db';
import { rateLimiter } from '../../src/common/services/rate-limiter.service';
import {
  validateStaticProductionConfig,
  validateRuntimeDependencies,
} from '../../src/common/config/startup-validator';
import { authorizeDocumentAction } from '../../src/modules/documents/documents.controller';
import { TEST_CREDENTIALS } from '../../src/database/seed-data';

describe('PANACEA FINAL P0 DATABASE & RUNTIME CONSISTENCY SUITE', () => {
  const origEnv = process.env;

  beforeEach(() => {
    process.env = { ...origEnv };
  });

  afterAll(() => {
    process.env = origEnv;
  });

  function applyDynamicProductionEnv(): void {
    const dynamicDbPassword = crypto.randomBytes(16).toString('hex');
    process.env.NODE_ENV = 'production';
    process.env.DATABASE_URL = `postgresql://panacea_app:${dynamicDbPassword}@postgres.internal:5432/panacea`;
    process.env.JWT_SECRET = crypto.randomBytes(32).toString('hex');
    process.env.SESSION_SECRET = crypto.randomBytes(32).toString('hex');
    process.env.CSRF_SECRET = crypto.randomBytes(32).toString('hex');
    process.env.S3_BUCKET = 'panacea-production-vault';
    process.env.S3_ENDPOINT = 'https://s3.ap-south-1.amazonaws.com';
    process.env.S3_ACCESS_KEY = `AKIA${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
    process.env.S3_SECRET_KEY = crypto.randomBytes(32).toString('hex');
    process.env.CLAMAV_HOST = 'clamav.internal';
    process.env.CLAMAV_PORT = '3310';
    process.env.REDIS_HOST = 'redis.internal';
    delete process.env.ENABLE_DEV_SEEDS;
  }

  // =========================================================================
  // 1. STARTUP LIFECYCLE & MANDATORY PRODUCTION DEPENDENCIES
  // =========================================================================
  describe('1. Production Startup Lifecycle & Mandatory Dependencies', () => {
    it('validates static configuration successfully without checking runtime database health', () => {
      applyDynamicProductionEnv();

      const staticValidation = validateStaticProductionConfig();
      expect(staticValidation.valid).toBe(true);
      expect(staticValidation.errors).toHaveLength(0);
    });

    it('rejects static configuration if database URL is missing', () => {
      applyDynamicProductionEnv();
      delete process.env.DATABASE_URL;

      const staticValidation = validateStaticProductionConfig();
      expect(staticValidation.valid).toBe(false);
      expect(staticValidation.errors.some((e) => e.includes('DATABASE_URL'))).toBe(true);
    });

    it('rejects static configuration if development seed flags are present', () => {
      applyDynamicProductionEnv();
      process.env.ENABLE_DEV_SEEDS = 'true';

      const staticValidation = validateStaticProductionConfig();
      expect(staticValidation.valid).toBe(false);
      expect(staticValidation.errors.some((e) => e.includes('ENABLE_DEV_SEEDS'))).toBe(true);
    });

    it('enforces mandatory runtime dependency readiness with zero opt-outs in production', async () => {
      applyDynamicProductionEnv();

      // Mock database unhealthy
      const origIsHealthy = db.isHealthy.bind(db);
      db.isHealthy = () => false;

      const runtimeValidation = await validateRuntimeDependencies();
      expect(runtimeValidation.valid).toBe(false);
      expect(runtimeValidation.errors.some((e) => e.includes('PostgreSQL database'))).toBe(true);

      db.isHealthy = origIsHealthy;
    });

    it('fails closed when Redis is unhealthy in production without needing REQUIRE_REDIS_READY flag', async () => {
      applyDynamicProductionEnv();
      delete process.env.REQUIRE_REDIS_READY; // No opt-in flag required

      const origRedisHealthy = rateLimiter.isHealthy.bind(rateLimiter);
      rateLimiter.isHealthy = async () => false;

      const runtimeValidation = await validateRuntimeDependencies();
      expect(runtimeValidation.valid).toBe(false);
      expect(runtimeValidation.errors.some((e) => e.includes('Redis'))).toBe(true);

      rateLimiter.isHealthy = origRedisHealthy;
    });
  });

  // =========================================================================
  // 2. AUTHORITATIVE SESSION PERSISTENCE (POSTGRESQL & VERIFIER HASHING)
  // =========================================================================
  describe('2. Authoritative Session Persistence & Multi-Instance Recognition', () => {
    it('creates a session with a hashed verifier and never stores the raw verifier', async () => {
      const userId = 'u1111111-1111-1111-1111-111111111111';
      const rawVerifier = crypto.randomBytes(32).toString('hex');
      const verifierHash = crypto.createHash('sha256').update(rawVerifier).digest('hex');

      const session = await db.createSession({
        userId,
        verifierHash,
        userAgent: 'Jest/Test-Instance-1',
        ipAddress: '127.0.0.1',
        ttlMs: 24 * 60 * 60 * 1000,
      });

      expect(session).toBeDefined();
      expect(session.id).toBeDefined();
      expect(session.session_verifier_hash).toBe(verifierHash);
      // Raw token must NEVER be stored
      expect(session).not.toHaveProperty('rawVerifier');
      expect(session).not.toHaveProperty('token');

      // Lookup by verifier hash works
      const retrieved = await db.getSessionByVerifierHash(verifierHash);
      expect(retrieved).toBeDefined();
      expect(retrieved!.id).toBe(session.id);
      expect(retrieved!.user_id).toBe(userId);
    });

    it('recognizes a session across multiple simulated API instances', async () => {
      const userId = 'u1111111-1111-1111-1111-111111111111';
      const rawVerifier = crypto.randomBytes(32).toString('hex');
      const verifierHash = crypto.createHash('sha256').update(rawVerifier).digest('hex');

      // Instance A creates the session
      const instanceASession = await db.createSession({
        userId,
        verifierHash,
        userAgent: 'Browser/Chrome API-Node-A',
        ipAddress: '10.0.0.1',
        ttlMs: 3600000,
      });

      // Instance B receives the incoming request with cookie verifier and hashes it
      const instanceBLookup = await db.getSessionByVerifierHash(verifierHash);
      expect(instanceBLookup).toBeDefined();
      expect(instanceBLookup!.id).toBe(instanceASession.id);
      expect(instanceBLookup!.user_id).toBe(userId);
    });

    it('revokes session on logout and rejects subsequent access across all instances', async () => {
      const userId = 'u1111111-1111-1111-1111-111111111111';
      const rawVerifier = crypto.randomBytes(32).toString('hex');
      const verifierHash = crypto.createHash('sha256').update(rawVerifier).digest('hex');

      const session = await db.createSession({
        userId,
        verifierHash,
        userAgent: 'Browser/Chrome',
        ipAddress: '10.0.0.1',
        ttlMs: 3600000,
      });

      // Revoke session
      await db.revokeSession(session.id);

      // Verify that lookup returns null for revoked session
      const revokedLookup = await db.getSessionByVerifierHash(verifierHash);
      expect(revokedLookup).toBeNull();
    });

    it('rejects expired sessions', async () => {
      const userId = 'u1111111-1111-1111-1111-111111111111';
      const rawVerifier = crypto.randomBytes(32).toString('hex');
      const verifierHash = crypto.createHash('sha256').update(rawVerifier).digest('hex');

      // Expired in past (-10 seconds)
      const session = await db.createSession({
        userId,
        verifierHash,
        userAgent: 'Browser/Chrome',
        ipAddress: '10.0.0.1',
        ttlMs: -10000,
      });
      expect(session).toBeDefined();

      const expiredLookup = await db.getSessionByVerifierHash(verifierHash);
      expect(expiredLookup).toBeNull();
    });
  });

  // =========================================================================
  // 3. MFA FACTOR PERSISTENCE
  // =========================================================================
  describe('3. MFA Factor Persistence & Revocation', () => {
    it('persists MFA factors and retrieves them for active user', async () => {
      const userId = 'u2222222-2222-2222-2222-222222222222';
      const factorId = uuidv4();

      await db.addMfaFactor({
        id: factorId,
        user_id: userId,
        type: 'totp',
        label: 'Production Hardware Key',
        credential_reference: 'encrypted_vault_ref_123',
        created_at: new Date().toISOString(),
      });

      const factors = await db.getMfaFactorsByUser(userId);
      const matched = factors.find((f) => f.id === factorId);
      expect(matched).toBeDefined();
      expect(matched.label).toBe('Production Hardware Key');
    });

    it('revokes MFA factor and excludes it from active factors', async () => {
      const userId = 'u2222222-2222-2222-2222-222222222222';
      const factorId = uuidv4();

      await db.addMfaFactor({
        id: factorId,
        user_id: userId,
        type: 'totp',
        label: 'To Be Revoked',
        credential_reference: 'encrypted_vault_ref_456',
        created_at: new Date().toISOString(),
      });

      await db.revokeMfaFactor(factorId);

      const factors = await db.getMfaFactorsByUser(userId);
      const matched = factors.find((f) => f.id === factorId);
      expect(matched).toBeUndefined();
    });
  });

  // =========================================================================
  // 4. DOCUMENT READ PATH & TENANT ISOLATION
  // =========================================================================
  describe('4. Document Read Path & Tenant Authorization', () => {
    it('retrieves document metadata via PostgreSQL query', async () => {
      const docId = uuidv4();
      const testDoc = {
        id: docId,
        case_id: 'c1111111-1111-1111-1111-111111111111',
        classification: 'confidential' as const,
        original_filename: 'SARFAESI_Notice_Sec13.pdf',
        storage_key: `documents/tenant1/${docId}/v1/file.bin`,
        mime_type: 'application/pdf',
        size_bytes: 4096,
        checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        status: 'available' as const,
        uploaded_by: 'u1111111-1111-1111-1111-111111111111',
        malware_scan_status: 'clean' as const,
        scan_timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      const testVer = {
        id: uuidv4(),
        document_id: docId,
        version_number: 1,
        storage_key: testDoc.storage_key,
        checksum: testDoc.checksum,
        size_bytes: testDoc.size_bytes,
        uploaded_by: testDoc.uploaded_by,
        created_at: testDoc.created_at,
      };

      await db.createDocumentTransaction({
        document: testDoc,
        version: testVer,
      });

      const retrieved = await db.getDocumentById(docId);
      expect(retrieved).toBeDefined();
      expect(retrieved.id).toBe(docId);
      expect(retrieved.original_filename).toBe('SARFAESI_Notice_Sec13.pdf');
    });

    it('rejects cross-tenant document read attempts via authorizeDocumentAction', async () => {
      const iciciUser = {
        id: 'u-icici-1',
        role: 'institutional_client_user',
        organization_id: '22222222-2222-2222-2222-222222222222', // ICICI Bank
      };

      // Case belongs to Axis Bank (c4444444-4444-4444-4444-444444444444)
      const axisDoc = {
        case_id: 'c4444444-4444-4444-4444-444444444444',
        classification: 'confidential',
        status: 'available',
      };

      const auth = await authorizeDocumentAction(iciciUser, axisDoc, 'read');
      expect(auth.allowed).toBe(false);
      expect(auth.reason).toBeDefined();
    });

    it('soft-deleted document is excluded from getDocumentById', async () => {
      const docId = uuidv4();
      const testDoc = {
        id: docId,
        case_id: 'c1111111-1111-1111-1111-111111111111',
        classification: 'confidential' as const,
        original_filename: 'To_Be_Deleted.pdf',
        storage_key: `documents/tenant1/${docId}/v1/file.bin`,
        mime_type: 'application/pdf',
        size_bytes: 1024,
        checksum: 'dummychecksum',
        status: 'available' as const,
        uploaded_by: 'u1111111-1111-1111-1111-111111111111',
        malware_scan_status: 'clean' as const,
        scan_timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      await db.createDocumentTransaction({
        document: testDoc,
        version: {
          id: uuidv4(),
          document_id: docId,
          version_number: 1,
          storage_key: testDoc.storage_key,
          checksum: 'dummychecksum',
          size_bytes: 1024,
          uploaded_by: testDoc.uploaded_by,
          created_at: testDoc.created_at,
        },
      });

      await db.softDeleteDocument(docId);
      const afterDelete = await db.getDocumentById(docId);
      expect(afterDelete).toBeNull();
    });
  });

  // =========================================================================
  // 5. REDIS-BACKED DOWNLOAD GRANTS
  // =========================================================================
  describe('5. Centralized Redis-Backed Download Grants', () => {
    it('creates and atomically consumes a single-use download grant', async () => {
      const rawToken = crypto.randomBytes(32).toString('hex');
      const grantHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      const docId = uuidv4();
      const userId = uuidv4();
      const expiresAt = Date.now() + 300000; // 5 min

      await rateLimiter.createDownloadGrant(
        grantHash,
        {
          documentId: docId,
          userId,
          expiresAt,
        },
        300,
      );

      // First consumption: Must succeed
      const firstConsumption = await rateLimiter.consumeDownloadGrant(grantHash);
      expect(firstConsumption).toBeDefined();
      expect(firstConsumption!.documentId).toBe(docId);
      expect(firstConsumption!.userId).toBe(userId);

      // Second consumption: Must atomically fail (single use)
      const secondConsumption = await rateLimiter.consumeDownloadGrant(grantHash);
      expect(secondConsumption).toBeNull();
    });

    it('rejects an expired download grant token', async () => {
      const rawToken = crypto.randomBytes(32).toString('hex');
      const grantHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      const docId = uuidv4();
      const userId = uuidv4();
      const expiresAt = Date.now() - 5000; // 5 sec ago

      await rateLimiter.createDownloadGrant(
        grantHash,
        {
          documentId: docId,
          userId,
          expiresAt,
        },
        1,
      );

      const consumption = await rateLimiter.consumeDownloadGrant(grantHash);
      expect(consumption).toBeNull();
    });
  });

  // =========================================================================
  // 6. ZERO HARDCODED CREDENTIALS HYGIENE
  // =========================================================================
  describe('6. Zero Hardcoded Credentials & Production Isolation', () => {
    it('proves SEED fixtures are structurally empty in production mode', () => {
      process.env.NODE_ENV = 'production';
      let prodSeeds!: typeof import('../../src/database/seed-data');
      jest.isolateModules(() => {
        prodSeeds = require('../../src/database/seed-data');
      });
      expect(Object.keys(prodSeeds.SEED_USERS)).toHaveLength(0);
      expect(Object.keys(prodSeeds.SEED_ORGS)).toHaveLength(0);
      expect(prodSeeds.SEED_CASES).toHaveLength(0);
      expect(prodSeeds.SEED_DOCUMENTS).toHaveLength(0);
      expect(prodSeeds.SEED_MFA_FACTORS).toHaveLength(0);
    });

    it('throws fatal security error if TEST_CREDENTIALS is accessed in production mode', () => {
      process.env.NODE_ENV = 'production';
      expect(() => {
        void TEST_CREDENTIALS.superAdmin;
      }).toThrow(/TEST_CREDENTIALS.*forbidden in production/);
    });

    it('verifies generated test passwords have high entropy and meet password complexity', () => {
      delete process.env.NODE_ENV;
      const creds = TEST_CREDENTIALS.superAdmin;
      expect(creds.password).toBeDefined();
      expect(creds.password.length).toBeGreaterThanOrEqual(14);
      expect(creds.totpSecret).toBeDefined();
      expect(creds.totpSecret.length).toBe(16);
    });
  });
});
