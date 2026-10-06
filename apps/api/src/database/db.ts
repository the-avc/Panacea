import * as crypto from 'crypto';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import {
  SEED_ORGS,
  SEED_ROLES,
  SEED_PERMISSIONS,
  SEED_USERS,
  SEED_CASES,
  SEED_DOCUMENTS,
  SEED_MFA_FACTORS,
} from './seed-data';
import { computeAuditRecordHash, GENESIS_PREVIOUS_HASH } from '../common/middleware/audit';

/**
 * PANACEA CONSULTANCY — Database Management Service
 *
 * Implements:
 * 1. Explicit async initialization lifecycle (NO unawaited constructor connections)
 * 2. PostgreSQL 16 connection pooling with TLS & strict parameterization
 * 3. Fail-closed behavior in production: Refuses in-memory fallback when NODE_ENV === 'production'
 * 4. Production exclusion: Seed fixtures and in-memory stores are structurally forbidden in production
 * 5. Transactional integrity helpers (BEGIN ... COMMIT / ROLLBACK)
 * 6. Tenant-isolation helper primitives
 */
export class DatabaseService {
  private static instance: DatabaseService;
  private pool: Pool | null = null;
  private usePostgres = false;

  // In-memory collections (for dev/test resilience ONLY — strictly empty in production)
  public organizations: any[] = [];
  public users: any[] = [];
  public organizationMemberships: any[] = [];
  public roles: any[] = [];
  public permissions: any[] = [];
  public userRoles: any[] = [];
  public cases: any[] = [];
  public caseAssignments: any[] = [];
  public caseStatusHistory: any[] = [];
  public documents: any[] = [];
  public documentVersions: any[] = [];
  public sessions: any[] = [];
  public mfaFactors: any[] = [];
  public auditLogs: any[] = [];
  public securityEvents: any[] = [];
  public notifications: any[] = [];

  private constructor() {
    // In production, NEVER populate in-memory arrays and NEVER start background fire-and-forget
    if (process.env.NODE_ENV !== 'production') {
      this.initInMemoryData();
    }
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Explicit sequential async initialization.
   * MUST be awaited before listening for HTTP traffic.
   */
  public async initialize(): Promise<void> {
    const isProd = process.env.NODE_ENV === 'production';
    const dbUrl = process.env.DATABASE_URL;

    // Fail if development seed data is accidentally enabled in production
    if (isProd && (process.env.ENABLE_DEV_SEEDS === 'true' || process.env.SEED_DEMO_DATA === 'true')) {
      throw new Error(
        '[DB] FATAL: Development seed fixtures are strictly forbidden when NODE_ENV=production.',
      );
    }

    if (isProd) {
      if (!dbUrl) {
        this.usePostgres = false;
        throw new Error(
          '[DB] FATAL: Production environment requires persistent DATABASE_URL. In-memory datastore is strictly forbidden.',
        );
      }

      try {
        this.pool = new Pool({
          connectionString: dbUrl,
          ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
          connectionTimeoutMillis: 5000,
        });

        const client = await this.pool.connect();
        await client.query('SELECT 1');
        client.release();
        this.usePostgres = true;
        console.log('[DB] Connected and verified PostgreSQL 16.');
      } catch (err: any) {
        this.usePostgres = false;
        throw new Error(
          `[DB] FATAL: PostgreSQL connection failed in production (${err.message}). Fail-closed policy prevents startup.`,
        );
      }
    } else {
      // Non-production (dev/test mode)
      if (dbUrl) {
        try {
          this.pool = new Pool({
            connectionString: dbUrl,
            ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
            connectionTimeoutMillis: 3000,
          });
          const client = await this.pool.connect();
          await client.query('SELECT 1');
          client.release();
          this.usePostgres = true;
          console.log('[DB] Connected to PostgreSQL 16 (non-prod).');
        } catch {
          this.usePostgres = false;
          if (this.users.length === 0) {
            this.initInMemoryData();
          }
        }
      } else {
        this.usePostgres = false;
        if (this.users.length === 0) {
          this.initInMemoryData();
        }
      }
    }
  }

  private initInMemoryData() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('[DB] FATAL: In-memory seed fixtures are strictly forbidden in production.');
    }

    // Orgs
    this.organizations = Object.values(SEED_ORGS).map((o) => ({
      ...o,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // Roles & Permissions
    this.roles = Object.values(SEED_ROLES);
    this.permissions = [...SEED_PERMISSIONS];

    // Users (populated only in dev/test)
    this.users = Object.values(SEED_USERS).map((u) => ({
      id: u.id,
      email: u.email,
      display_name: u.display_name,
      password_hash: u.password_hash,
      status: u.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login_at: null,
    }));

    // Memberships & Roles
    Object.values(SEED_USERS).forEach((u) => {
      this.organizationMemberships.push({
        id: `mem-${u.id}`,
        organization_id: u.org_id,
        user_id: u.id,
        status: 'active',
        created_at: new Date().toISOString(),
        revoked_at: null,
      });

      const roleObj = Object.values(SEED_ROLES).find((r) => r.name === u.role);
      if (roleObj) {
        this.userRoles.push({
          id: `ur-${u.id}`,
          user_id: u.id,
          role_id: roleObj.id,
          organization_id: u.org_id,
          created_at: new Date().toISOString(),
        });
      }
    });

    // Cases
    this.cases = [...SEED_CASES];

    // Documents
    this.documents = [...SEED_DOCUMENTS];

    // MFA factors for testing
    this.mfaFactors = [...SEED_MFA_FACTORS];

    // Initial genesis audit log entry with canonical cryptographic hash
    const genesisCore = {
      id: 'a0000000-0000-0000-0000-000000000001',
      actor_user_id: null,
      organization_id: null,
      event_type: 'SYSTEM_BOOT',
      action: 'INITIALIZE',
      resource_type: 'SYSTEM',
      resource_id: null,
      result: 'success',
      request_id: 'boot-init-001',
      created_at: new Date().toISOString(),
      previous_hash: GENESIS_PREVIOUS_HASH,
    };

    const genesisHash = computeAuditRecordHash(genesisCore);

    this.auditLogs.push({
      ...genesisCore,
      hash: genesisHash,
      metadata: { message: 'Panacea Security Platform initialized with cryptographic audit chain' },
    });
  }

  /**
   * Safe parameterized query executor with production fail-closed defense
   */
  public async query(text: string, params: any[] = []): Promise<any> {
    if (this.usePostgres && this.pool) {
      try {
        return await this.pool.query(text, params);
      } catch (err: any) {
        if (process.env.NODE_ENV === 'production') {
          throw new Error(`[DB] 503 Service Unavailable: Database query execution failure: ${err.message}`);
        }
        throw err;
      }
    }

    if (process.env.NODE_ENV === 'production') {
      throw new Error('[DB] 503 Service Unavailable: Persistent database connection is offline.');
    }

    // Dev/test queries
    return { rows: [], rowCount: 0 };
  }

  /**
   * Document and Version creation within a real PostgreSQL transaction.
   * Atomically commits document, document version, and audit event or rolls back.
   */
  public async createDocumentTransaction(params: {
    document: {
      id: string;
      case_id: string;
      classification: 'confidential' | 'restricted';
      original_filename: string;
      storage_key: string;
      mime_type: string;
      size_bytes: number;
      checksum: string;
      status: 'available' | 'quarantined' | 'deleted';
      uploaded_by: string;
      created_at: string;
    };
    version: {
      id: string;
      document_id: string;
      version_number: number;
      storage_key: string;
      checksum: string;
      size_bytes: number;
      uploaded_by: string;
      created_at: string;
    };
    auditEvent?: {
      id: string;
      actor_user_id?: string | null;
      actorUserId?: string | null;
      organization_id?: string | null;
      organizationId?: string | null;
      event_type?: string;
      eventType?: string;
      action: string;
      resource_type?: string;
      resourceType?: string;
      resource_id?: string;
      resourceId?: string;
      result: 'success' | 'failure' | 'denied';
      request_id?: string;
      requestId?: string;
      metadata?: any;
    };
  }): Promise<any> {
    if (this.usePostgres && this.pool) {
      const client = await this.pool.connect();
      try {
        await client.query('BEGIN');

        const docInsertSql = `
          INSERT INTO documents (
            id, case_id, classification, original_filename,
            storage_key, mime_type, size_bytes, checksum,
            status, uploaded_by, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          RETURNING *;
        `;
        const docRes = await client.query(docInsertSql, [
          params.document.id,
          params.document.case_id,
          params.document.classification,
          params.document.original_filename,
          params.document.storage_key,
          params.document.mime_type,
          params.document.size_bytes,
          params.document.checksum,
          params.document.status,
          params.document.uploaded_by,
          params.document.created_at,
        ]);

        const verInsertSql = `
          INSERT INTO document_versions (
            id, document_id, version_number, storage_key,
            checksum, size_bytes, uploaded_by, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *;
        `;
        await client.query(verInsertSql, [
          params.version.id,
          params.version.document_id,
          params.version.version_number,
          params.version.storage_key,
          params.version.checksum,
          params.version.size_bytes,
          params.version.uploaded_by,
          params.version.created_at,
        ]);

        if (params.auditEvent) {
          const auditInsertSql = `
            INSERT INTO audit_logs (
              id, actor_user_id, organization_id, event_type,
              action, resource_type, resource_id, result,
              request_id, created_at, metadata
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), $10);
          `;
          await client.query(auditInsertSql, [
            params.auditEvent.id,
            params.auditEvent.actor_user_id || params.auditEvent.actorUserId || null,
            params.auditEvent.organization_id || params.auditEvent.organizationId || null,
            params.auditEvent.event_type || params.auditEvent.eventType,
            params.auditEvent.action,
            params.auditEvent.resource_type || params.auditEvent.resourceType,
            params.auditEvent.resource_id || params.auditEvent.resourceId,
            params.auditEvent.result,
            params.auditEvent.request_id || params.auditEvent.requestId,
            JSON.stringify(params.auditEvent.metadata || {}),
          ]);
        }

        await client.query('COMMIT');
        return docRes.rows[0];
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    }

    if (process.env.NODE_ENV === 'production') {
      throw new Error('[DB] FATAL: Persistent database connection is offline in production.');
    }

    // Atomic in-memory emulation strictly for unit testing
    this.documents.push(params.document);
    this.documentVersions.push(params.version);
    return params.document;
  }

  /**
   * Generic transaction wrapper
   */
  public async transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    if (this.usePostgres && this.pool) {
      const client = await this.pool.connect();
      try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    }

    if (process.env.NODE_ENV === 'production') {
      throw new Error('[DB] FATAL: Persistent PostgreSQL connection is required in production.');
    }

    return await callback(null);
  }

  public isHealthy(): boolean {
    if (process.env.NODE_ENV === 'production') {
      return this.usePostgres && this.pool !== null;
    }
    return true;
  }

  /**
   * Fail-closed defense: In production, in-memory operations are strictly forbidden.
   */
  private checkProductionFailClosed(operation: string): void {
    if (process.env.NODE_ENV === 'production' && (!this.usePostgres || !this.pool)) {
      throw new Error(
        `[DB] FATAL: Production requires authoritative PostgreSQL connection for '${operation}'. In-memory datastore is strictly forbidden.`,
      );
    }
  }

  // =========================================================================
  // SESSIONS — AUTHORITATIVE POSTGRESQL PERSISTENCE
  // =========================================================================

  public async createSession(session: {
    id?: string;
    user_id?: string;
    userId?: string;
    session_hash?: string;
    session_verifier_hash?: string;
    verifierHash?: string;
    device_metadata?: any;
    userAgent?: string;
    ipAddress?: string;
    created_at?: string;
    expires_at?: string;
    revoked_at?: string | null;
    last_seen_at?: string;
    ttlMs?: number;
  }): Promise<any> {
    this.checkProductionFailClosed('createSession');
    const id = session.id || uuidv4();
    const userId = session.user_id || session.userId || '';
    const hash = session.session_hash || session.session_verifier_hash || session.verifierHash || '';
    const now = new Date();
    const createdAt = session.created_at || now.toISOString();
    const ttl = session.ttlMs !== undefined ? session.ttlMs : 24 * 60 * 60 * 1000;
    const expiresAt = session.expires_at || new Date(now.getTime() + ttl).toISOString();
    const revokedAt = session.revoked_at || null;
    const lastSeenAt = session.last_seen_at || now.toISOString();
    const deviceMetadata = session.device_metadata || {
      userAgent: session.userAgent || '',
      ipAddress: session.ipAddress || '',
    };

    const record = {
      id,
      user_id: userId,
      session_hash: hash,
      session_verifier_hash: hash,
      device_metadata: deviceMetadata,
      created_at: createdAt,
      expires_at: expiresAt,
      revoked_at: revokedAt,
      last_seen_at: lastSeenAt,
    };

    if (this.usePostgres && this.pool) {
      const sql = `
        INSERT INTO sessions (
          id, user_id, session_hash, device_metadata, created_at, expires_at, revoked_at, last_seen_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;
      const res = await this.pool.query(sql, [
        record.id,
        record.user_id,
        record.session_hash,
        JSON.stringify(record.device_metadata),
        record.created_at,
        record.expires_at,
        record.revoked_at,
        record.last_seen_at,
      ]);
      return {
        ...res.rows[0],
        session_verifier_hash: res.rows[0].session_hash,
      };
    }

    this.sessions.push(record);
    return record;
  }

  public async getSessionByVerifierHash(sessionHash: string): Promise<any | null> {
    this.checkProductionFailClosed('getSessionByVerifierHash');
    if (this.usePostgres && this.pool) {
      const sql = `
        SELECT * FROM sessions
        WHERE session_hash = $1
          AND revoked_at IS NULL
          AND expires_at > NOW()
        LIMIT 1;
      `;
      const res = await this.pool.query(sql, [sessionHash]);
      if (!res.rows[0]) return null;
      return {
        ...res.rows[0],
        session_verifier_hash: res.rows[0].session_hash,
      };
    }

    const now = new Date();
    const s = this.sessions.find(
      (item) =>
        (item.session_hash === sessionHash || item.session_verifier_hash === sessionHash) &&
        !item.revoked_at &&
        new Date(item.expires_at) > now,
    );
    return s || null;
  }

  public async getSessionById(sessionId: string): Promise<any | null> {
    this.checkProductionFailClosed('getSessionById');
    if (this.usePostgres && this.pool) {
      const sql = `SELECT * FROM sessions WHERE id = $1 LIMIT 1;`;
      const res = await this.pool.query(sql, [sessionId]);
      return res.rows[0] || null;
    }

    return this.sessions.find((s) => s.id === sessionId) || null;
  }

  public async touchSession(sessionId: string): Promise<void> {
    this.checkProductionFailClosed('touchSession');
    if (this.usePostgres && this.pool) {
      await this.pool.query(`UPDATE sessions SET last_seen_at = NOW() WHERE id = $1;`, [sessionId]);
      return;
    }

    const s = this.sessions.find((x) => x.id === sessionId);
    if (s) {
      s.last_seen_at = new Date().toISOString();
    }
  }

  public async revokeSession(sessionId: string): Promise<void> {
    this.checkProductionFailClosed('revokeSession');
    if (this.usePostgres && this.pool) {
      await this.pool.query(`UPDATE sessions SET revoked_at = NOW() WHERE id = $1;`, [sessionId]);
      return;
    }

    const s = this.sessions.find((x) => x.id === sessionId);
    if (s) {
      s.revoked_at = new Date().toISOString();
    }
  }

  public async getActiveSessionsByUser(userId: string): Promise<any[]> {
    this.checkProductionFailClosed('getActiveSessionsByUser');
    if (this.usePostgres && this.pool) {
      const sql = `
        SELECT id, user_id, device_metadata, created_at, expires_at, revoked_at, last_seen_at
        FROM sessions
        WHERE user_id = $1 AND revoked_at IS NULL AND expires_at > NOW()
        ORDER BY created_at DESC;
      `;
      const res = await this.pool.query(sql, [userId]);
      return res.rows;
    }

    return this.sessions.filter(
      (s) => s.user_id === userId && !s.revoked_at && new Date(s.expires_at) > new Date(),
    );
  }

  public async revokeAllUserSessions(userId: string): Promise<number> {
    this.checkProductionFailClosed('revokeAllUserSessions');
    if (this.usePostgres && this.pool) {
      const sql = `UPDATE sessions SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL;`;
      const res = await this.pool.query(sql, [userId]);
      return res.rowCount || 0;
    }

    let count = 0;
    this.sessions
      .filter((s) => s.user_id === userId && !s.revoked_at)
      .forEach((s) => {
        s.revoked_at = new Date().toISOString();
        count++;
      });
    return count;
  }

  // =========================================================================
  // MFA FACTORS — AUTHORITATIVE POSTGRESQL PERSISTENCE
  // =========================================================================

  public async getMfaFactorsByUser(userId: string): Promise<any[]> {
    this.checkProductionFailClosed('getMfaFactorsByUser');
    if (this.usePostgres && this.pool) {
      const sql = `
        SELECT id, user_id, type, label, credential_reference, created_at, last_used_at, revoked_at
        FROM mfa_factors
        WHERE user_id = $1 AND revoked_at IS NULL
        ORDER BY created_at ASC;
      `;
      const res = await this.pool.query(sql, [userId]);
      return res.rows;
    }

    return this.mfaFactors.filter((f) => f.user_id === userId && !f.revoked_at);
  }

  public async addMfaFactor(factor: {
    id: string;
    user_id: string;
    type: string;
    label: string;
    credential_reference: string;
    created_at: string;
  }): Promise<any> {
    this.checkProductionFailClosed('addMfaFactor');
    if (this.usePostgres && this.pool) {
      const sql = `
        INSERT INTO mfa_factors (id, user_id, type, label, credential_reference, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, user_id, type, label, created_at;
      `;
      const res = await this.pool.query(sql, [
        factor.id,
        factor.user_id,
        factor.type,
        factor.label,
        factor.credential_reference,
        factor.created_at,
      ]);
      return res.rows[0];
    }

    this.mfaFactors.push(factor);
    return factor;
  }

  public async revokeMfaFactor(factorId: string): Promise<void> {
    this.checkProductionFailClosed('revokeMfaFactor');
    if (this.usePostgres && this.pool) {
      await this.pool.query(`UPDATE mfa_factors SET revoked_at = NOW() WHERE id = $1;`, [factorId]);
      return;
    }

    const f = this.mfaFactors.find((x) => x.id === factorId);
    if (f) {
      f.revoked_at = new Date().toISOString();
    }
  }

  // =========================================================================
  // USERS, ROLES & ORGANIZATIONS — AUTHORITATIVE POSTGRESQL PERSISTENCE
  // =========================================================================

  public async ensureUserPasswordHash(user: any): Promise<void> {
    if (!user || user.password_hash) return;
    try {
      const argon2 = require('argon2');
      const { getDevTestCredentials } = require('./seed-data');
      const creds = getDevTestCredentials();
      for (const key of Object.keys(creds)) {
        const cred = creds[key];
        if (cred && cred.email && cred.email.toLowerCase() === user.email.toLowerCase()) {
          user.password_hash = await argon2.hash(cred.password);
          return;
        }
      }
      user.password_hash = await argon2.hash(crypto.randomBytes(32).toString('hex'));
    } catch {
      // Ignored
    }
  }

  public async getUserById(userId: string): Promise<any | null> {
    this.checkProductionFailClosed('getUserById');
    if (this.usePostgres && this.pool) {
      const sql = `
        SELECT id, email, display_name, password_hash, status, created_at, updated_at, last_login_at
        FROM users WHERE id = $1 LIMIT 1;
      `;
      const res = await this.pool.query(sql, [userId]);
      return res.rows[0] || null;
    }

    const u = this.users.find((user) => user.id === userId);
    if (u) {
      await this.ensureUserPasswordHash(u);
    }
    return u || null;
  }

  public async getUserByEmail(email: string): Promise<any | null> {
    this.checkProductionFailClosed('getUserByEmail');
    if (this.usePostgres && this.pool) {
      const sql = `
        SELECT id, email, display_name, password_hash, status, created_at, updated_at, last_login_at
        FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1;
      `;
      const res = await this.pool.query(sql, [email]);
      return res.rows[0] || null;
    }

    const u = this.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
    if (u) {
      await this.ensureUserPasswordHash(u);
    }
    return u || null;
  }

  public async getUserRole(userId: string): Promise<any | null> {
    this.checkProductionFailClosed('getUserRole');
    if (this.usePostgres && this.pool) {
      const sql = `
        SELECT r.id, r.name, r.description
        FROM roles r
        JOIN user_roles ur ON ur.role_id = r.id
        WHERE ur.user_id = $1
        LIMIT 1;
      `;
      const res = await this.pool.query(sql, [userId]);
      return res.rows[0] || null;
    }

    const ur = this.userRoles.find((r) => r.user_id === userId);
    if (!ur) return null;
    return this.roles.find((r) => r.id === ur.role_id) || null;
  }

  public async getUserOrg(userId: string): Promise<any | null> {
    this.checkProductionFailClosed('getUserOrg');
    if (this.usePostgres && this.pool) {
      const sql = `
        SELECT o.id, o.legal_name, o.status, o.created_at, o.updated_at
        FROM organizations o
        JOIN organization_memberships om ON om.organization_id = o.id
        WHERE om.user_id = $1 AND om.status = 'active' AND om.revoked_at IS NULL
        LIMIT 1;
      `;
      const res = await this.pool.query(sql, [userId]);
      return res.rows[0] || null;
    }

    const mem = this.organizationMemberships.find(
      (m) => m.user_id === userId && m.status === 'active' && !m.revoked_at,
    );
    if (!mem) return null;
    return this.organizations.find((o) => o.id === mem.organization_id) || null;
  }

  public async getAllUsers(): Promise<any[]> {
    this.checkProductionFailClosed('getAllUsers');
    if (this.usePostgres && this.pool) {
      const sql = `
        SELECT u.id, u.email, u.display_name, u.status, u.created_at, u.updated_at, u.last_login_at,
               o.legal_name as "organizationName", r.name as "roleName"
        FROM users u
        LEFT JOIN organization_memberships om ON om.user_id = u.id AND om.status = 'active' AND om.revoked_at IS NULL
        LEFT JOIN organizations o ON o.id = om.organization_id
        LEFT JOIN user_roles ur ON ur.user_id = u.id
        LEFT JOIN roles r ON r.id = ur.role_id
        ORDER BY u.created_at DESC;
      `;
      const res = await this.pool.query(sql);
      return res.rows;
    }

    return this.users.map((u) => {
      const org = this.getUserOrgSync(u.id);
      const role = this.getUserRoleSync(u.id);
      return {
        id: u.id,
        email: u.email,
        displayName: u.display_name,
        status: u.status,
        organizationName: org?.legal_name || 'Unassigned',
        roleName: role?.name || 'No Role',
        lastLoginAt: u.last_login_at,
        createdAt: u.created_at,
      };
    });
  }

  public async createUser(
    userData: {
      id: string;
      email: string;
      display_name: string;
      password_hash: string;
      status: string;
      created_at: string;
      updated_at: string;
    },
    membership?: { id: string; organization_id: string; user_id: string },
    userRole?: { id: string; user_id: string; role_id: string; organization_id?: string },
  ): Promise<any> {
    this.checkProductionFailClosed('createUser');
    if (this.usePostgres && this.pool) {
      const client = await this.pool.connect();
      try {
        await client.query('BEGIN');
        const userRes = await client.query(
          `INSERT INTO users (id, email, display_name, password_hash, status, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
          [
            userData.id,
            userData.email,
            userData.display_name,
            userData.password_hash,
            userData.status,
            userData.created_at,
            userData.updated_at,
          ],
        );

        if (membership) {
          await client.query(
            `INSERT INTO organization_memberships (id, organization_id, user_id, status)
             VALUES ($1, $2, $3, 'active');`,
            [membership.id, membership.organization_id, membership.user_id],
          );
        }

        if (userRole) {
          await client.query(
            `INSERT INTO user_roles (id, user_id, role_id, organization_id)
             VALUES ($1, $2, $3, $4);`,
            [userRole.id, userRole.user_id, userRole.role_id, userRole.organization_id || null],
          );
        }

        await client.query('COMMIT');
        return userRes.rows[0];
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    }

    this.users.push(userData);
    if (membership) this.organizationMemberships.push({ ...membership, status: 'active', created_at: new Date().toISOString() });
    if (userRole) this.userRoles.push({ ...userRole, created_at: new Date().toISOString() });
    return userData;
  }

  public async updateUser(userId: string, fields: Partial<{ display_name: string; status: string; last_login_at: string; updated_at: string }>): Promise<any> {
    this.checkProductionFailClosed('updateUser');
    if (this.usePostgres && this.pool) {
      const setClauses: string[] = ['updated_at = NOW()'];
      const values: any[] = [userId];
      let idx = 2;

      if (fields.display_name !== undefined) {
        setClauses.push(`display_name = $${idx++}`);
        values.push(fields.display_name);
      }
      if (fields.status !== undefined) {
        setClauses.push(`status = $${idx++}`);
        values.push(fields.status);
      }
      if (fields.last_login_at !== undefined) {
        setClauses.push(`last_login_at = $${idx++}`);
        values.push(fields.last_login_at);
      }

      const sql = `UPDATE users SET ${setClauses.join(', ')} WHERE id = $1 RETURNING *;`;
      const res = await this.pool.query(sql, values);
      return res.rows[0] || null;
    }

    const u = this.users.find((user) => user.id === userId);
    if (u) {
      Object.assign(u, fields, { updated_at: new Date().toISOString() });
    }
    return u || null;
  }

  public async disableUser(userId: string): Promise<number> {
    this.checkProductionFailClosed('disableUser');
    if (this.usePostgres && this.pool) {
      const client = await this.pool.connect();
      try {
        await client.query('BEGIN');
        await client.query(`UPDATE users SET status = 'disabled', updated_at = NOW() WHERE id = $1;`, [userId]);
        const res = await client.query(`UPDATE sessions SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL;`, [userId]);
        await client.query('COMMIT');
        return res.rowCount || 0;
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    }

    const u = this.users.find((user) => user.id === userId);
    if (u) {
      u.status = 'disabled';
      u.updated_at = new Date().toISOString();
    }
    return await this.revokeAllUserSessions(userId);
  }

  public async enableUser(userId: string): Promise<void> {
    this.checkProductionFailClosed('enableUser');
    if (this.usePostgres && this.pool) {
      await this.pool.query(`UPDATE users SET status = 'active', updated_at = NOW() WHERE id = $1;`, [userId]);
      return;
    }

    const u = this.users.find((user) => user.id === userId);
    if (u) {
      u.status = 'active';
      u.updated_at = new Date().toISOString();
    }
  }

  public async getOrgById(orgId: string): Promise<any | null> {
    this.checkProductionFailClosed('getOrgById');
    if (this.usePostgres && this.pool) {
      const sql = `SELECT * FROM organizations WHERE id = $1 LIMIT 1;`;
      const res = await this.pool.query(sql, [orgId]);
      return res.rows[0] || null;
    }

    return this.organizations.find((o) => o.id === orgId) || null;
  }

  public async getAllOrgs(userOrgId?: string): Promise<any[]> {
    this.checkProductionFailClosed('getAllOrgs');
    if (this.usePostgres && this.pool) {
      if (userOrgId) {
        const sql = `SELECT * FROM organizations WHERE id = $1;`;
        const res = await this.pool.query(sql, [userOrgId]);
        return res.rows;
      }
      const sql = `SELECT * FROM organizations ORDER BY legal_name ASC;`;
      const res = await this.pool.query(sql);
      return res.rows;
    }

    if (userOrgId) {
      return this.organizations.filter((o) => o.id === userOrgId);
    }
    return [...this.organizations];
  }

  public async getOrgMembers(orgId: string): Promise<any[]> {
    this.checkProductionFailClosed('getOrgMembers');
    if (this.usePostgres && this.pool) {
      const sql = `
        SELECT u.id, u.email, u.display_name as "displayName", u.status, om.created_at as "joinedAt"
        FROM users u
        JOIN organization_memberships om ON om.user_id = u.id
        WHERE om.organization_id = $1 AND om.status = 'active' AND om.revoked_at IS NULL
        ORDER BY om.created_at ASC;
      `;
      const res = await this.pool.query(sql, [orgId]);
      return res.rows;
    }

    const memberUserIds = this.organizationMemberships
      .filter((m) => m.organization_id === orgId && m.status === 'active' && !m.revoked_at)
      .map((m) => m.user_id);

    return this.users
      .filter((u) => memberUserIds.includes(u.id))
      .map((u) => ({
        id: u.id,
        email: u.email,
        displayName: u.display_name,
        status: u.status,
      }));
  }

  public async createOrg(org: { id: string; legal_name: string; status: string; created_at: string; updated_at: string }): Promise<any> {
    this.checkProductionFailClosed('createOrg');
    if (this.usePostgres && this.pool) {
      const sql = `
        INSERT INTO organizations (id, legal_name, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const res = await this.pool.query(sql, [org.id, org.legal_name, org.status, org.created_at, org.updated_at]);
      return res.rows[0];
    }

    this.organizations.push(org);
    return org;
  }

  public async updateOrgStatus(orgId: string, status: string): Promise<any> {
    this.checkProductionFailClosed('updateOrgStatus');
    if (this.usePostgres && this.pool) {
      const res = await this.pool.query(
        `UPDATE organizations SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *;`,
        [status, orgId],
      );
      return res.rows[0] || null;
    }

    const org = this.organizations.find((o) => o.id === orgId);
    if (org) {
      org.status = status;
      org.updated_at = new Date().toISOString();
    }
    return org || null;
  }


  // =========================================================================
  // CASES — AUTHORITATIVE POSTGRESQL PERSISTENCE & TENANT ISOLATION
  // =========================================================================

  public async getCaseById(caseId: string, orgId?: string): Promise<any | null> {
    this.checkProductionFailClosed('getCaseById');
    if (this.usePostgres && this.pool) {
      if (orgId) {
        const sql = `SELECT * FROM cases WHERE id = $1 AND organization_id = $2 LIMIT 1;`;
        const res = await this.pool.query(sql, [caseId, orgId]);
        return res.rows[0] || null;
      }
      const sql = `SELECT * FROM cases WHERE id = $1 LIMIT 1;`;
      const res = await this.pool.query(sql, [caseId]);
      return res.rows[0] || null;
    }

    if (orgId) {
      return this.cases.find((c) => c.id === caseId && c.organization_id === orgId) || null;
    }
    return this.cases.find((c) => c.id === caseId) || null;
  }

  public async getCases(options: {
    orgId?: string;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ items: any[]; total: number }> {
    this.checkProductionFailClosed('getCases');
    if (this.usePostgres && this.pool) {
      const conditions: string[] = [];
      const values: any[] = [];
      let idx = 1;

      if (options.orgId) {
        conditions.push(`organization_id = $${idx++}`);
        values.push(options.orgId);
      }
      if (options.status) {
        conditions.push(`status = $${idx++}`);
        values.push(options.status);
      }
      if (options.search) {
        conditions.push(`(title ILIKE $${idx} OR external_reference ILIKE $${idx})`);
        values.push(`%${options.search}%`);
        idx++;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const countSql = `SELECT COUNT(*) FROM cases ${whereClause};`;
      const countRes = await this.pool.query(countSql, values);
      const total = parseInt(countRes.rows[0]?.count || '0', 10);

      const limit = options.limit || 25;
      const offset = options.offset || 0;
      const itemsSql = `
        SELECT * FROM cases ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${idx++} OFFSET $${idx++};
      `;
      const itemsRes = await this.pool.query(itemsSql, [...values, limit, offset]);

      return { items: itemsRes.rows, total };
    }

    let list = options.orgId ? this.cases.filter((c) => c.organization_id === options.orgId) : [...this.cases];
    if (options.status) {
      list = list.filter((c) => c.status === options.status);
    }
    if (options.search) {
      const term = options.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(term) ||
          (c.external_reference && c.external_reference.toLowerCase().includes(term)),
      );
    }
    const total = list.length;
    const limit = options.limit || 25;
    const offset = options.offset || 0;
    const items = list.slice(offset, offset + limit);
    return { items, total };
  }

  public async createCase(caseData: any, statusHistory: any): Promise<any> {
    this.checkProductionFailClosed('createCase');
    if (this.usePostgres && this.pool) {
      const client = await this.pool.connect();
      try {
        await client.query('BEGIN');
        const caseSql = `
          INSERT INTO cases (id, organization_id, external_reference, title, status, classification, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *;
        `;
        const caseRes = await client.query(caseSql, [
          caseData.id,
          caseData.organization_id,
          caseData.external_reference,
          caseData.title,
          caseData.status,
          caseData.classification,
          caseData.created_at,
          caseData.updated_at,
        ]);

        const historySql = `
          INSERT INTO case_status_history (id, case_id, old_status, new_status, changed_by, changed_at, reason)
          VALUES ($1, $2, $3, $4, $5, $6, $7);
        `;
        await client.query(historySql, [
          statusHistory.id,
          statusHistory.case_id,
          statusHistory.old_status,
          statusHistory.new_status,
          statusHistory.changed_by,
          statusHistory.changed_at,
          statusHistory.reason,
        ]);

        await client.query('COMMIT');
        return caseRes.rows[0];
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    }

    this.cases.unshift(caseData);
    this.caseStatusHistory.push(statusHistory);
    return caseData;
  }

  public async updateCaseStatus(caseId: string, newStatus: string, historyRecord: any): Promise<any> {
    this.checkProductionFailClosed('updateCaseStatus');
    if (this.usePostgres && this.pool) {
      const client = await this.pool.connect();
      try {
        await client.query('BEGIN');
        const caseRes = await client.query(
          `UPDATE cases SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *;`,
          [newStatus, caseId],
        );
        await client.query(
          `INSERT INTO case_status_history (id, case_id, old_status, new_status, changed_by, changed_at, reason)
           VALUES ($1, $2, $3, $4, $5, $6, $7);`,
          [
            historyRecord.id,
            historyRecord.case_id,
            historyRecord.old_status,
            historyRecord.new_status,
            historyRecord.changed_by,
            historyRecord.changed_at,
            historyRecord.reason,
          ],
        );
        await client.query('COMMIT');
        return caseRes.rows[0];
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    }

    const c = this.cases.find((item) => item.id === caseId);
    if (c) {
      c.status = newStatus;
      c.updated_at = new Date().toISOString();
    }
    this.caseStatusHistory.unshift(historyRecord);
    return c;
  }

  public async getCaseHistory(caseId: string): Promise<any[]> {
    this.checkProductionFailClosed('getCaseHistory');
    if (this.usePostgres && this.pool) {
      const sql = `SELECT * FROM case_status_history WHERE case_id = $1 ORDER BY changed_at DESC;`;
      const res = await this.pool.query(sql, [caseId]);
      return res.rows;
    }

    return this.caseStatusHistory.filter((h) => h.case_id === caseId);
  }

  public async isCaseAssignedToUser(caseId: string, userId: string): Promise<boolean> {
    this.checkProductionFailClosed('isCaseAssignedToUser');
    if (this.usePostgres && this.pool) {
      const sql = `SELECT 1 FROM case_assignments WHERE case_id = $1 AND user_id = $2 AND revoked_at IS NULL LIMIT 1;`;
      const res = await this.pool.query(sql, [caseId, userId]);
      return (res.rowCount || 0) > 0;
    }

    return this.caseAssignments.some((a) => a.case_id === caseId && a.user_id === userId && !a.revoked_at);
  }

  public async getCaseAssignments(caseId: string): Promise<any[]> {
    this.checkProductionFailClosed('getCaseAssignments');
    if (this.usePostgres && this.pool) {
      const sql = `
        SELECT ca.*, u.display_name as "userDisplayName", u.email as "userEmail"
        FROM case_assignments ca
        LEFT JOIN users u ON u.id = ca.user_id
        WHERE ca.case_id = $1 AND ca.revoked_at IS NULL
        ORDER BY ca.assigned_at DESC;
      `;
      const res = await this.pool.query(sql, [caseId]);
      return res.rows;
    }

    return this.caseAssignments
      .filter((a) => a.case_id === caseId && !a.revoked_at)
      .map((a) => {
        const user = a.user_id ? this.getUserByIdSync(a.user_id) : null;
        return {
          ...a,
          userDisplayName: user?.display_name || null,
          userEmail: user?.email || null,
        };
      });
  }

  public async addCaseAssignment(assignment: any): Promise<any> {
    this.checkProductionFailClosed('addCaseAssignment');
    if (this.usePostgres && this.pool) {
      const sql = `
        INSERT INTO case_assignments (id, case_id, user_id, team_reference, assignment_type, assigned_at, revoked_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;
      const res = await this.pool.query(sql, [
        assignment.id,
        assignment.case_id,
        assignment.user_id,
        assignment.team_reference,
        assignment.assignment_type,
        assignment.assigned_at,
        assignment.revoked_at || null,
      ]);
      return res.rows[0];
    }

    this.caseAssignments.push(assignment);
    return assignment;
  }


  // =========================================================================
  // DOCUMENTS — AUTHORITATIVE POSTGRESQL PERSISTENCE
  // =========================================================================

  public async getDocumentById(documentId: string): Promise<any | null> {
    this.checkProductionFailClosed('getDocumentById');
    if (this.usePostgres && this.pool) {
      const sql = `SELECT * FROM documents WHERE id = $1 AND status != 'deleted' LIMIT 1;`;
      const res = await this.pool.query(sql, [documentId]);
      return res.rows[0] || null;
    }

    return this.documents.find((d) => d.id === documentId && d.status !== 'deleted') || null;
  }

  public async getDocumentsByCase(caseId: string): Promise<any[]> {
    this.checkProductionFailClosed('getDocumentsByCase');
    if (this.usePostgres && this.pool) {
      const sql = `SELECT * FROM documents WHERE case_id = $1 AND status != 'deleted' ORDER BY created_at DESC;`;
      const res = await this.pool.query(sql, [caseId]);
      return res.rows;
    }

    return this.documents.filter((d) => d.case_id === caseId && d.status !== 'deleted');
  }

  public async getDocumentVersions(documentId: string): Promise<any[]> {
    this.checkProductionFailClosed('getDocumentVersions');
    if (this.usePostgres && this.pool) {
      const sql = `SELECT * FROM document_versions WHERE document_id = $1 ORDER BY version_number ASC;`;
      const res = await this.pool.query(sql, [documentId]);
      return res.rows;
    }

    return this.documentVersions.filter((v) => v.document_id === documentId);
  }

  public async softDeleteDocument(documentId: string): Promise<boolean> {
    this.checkProductionFailClosed('softDeleteDocument');
    if (this.usePostgres && this.pool) {
      const res = await this.pool.query(`UPDATE documents SET status = 'deleted' WHERE id = $1;`, [documentId]);
      return (res.rowCount || 0) > 0;
    }

    const doc = this.documents.find((d) => d.id === documentId);
    if (doc) {
      doc.status = 'deleted';
      return true;
    }
    return false;
  }

  // =========================================================================
  // NOTIFICATIONS — AUTHORITATIVE POSTGRESQL PERSISTENCE
  // =========================================================================

  public async getNotificationsByUser(userId: string): Promise<any[]> {
    this.checkProductionFailClosed('getNotificationsByUser');
    if (this.usePostgres && this.pool) {
      const sql = `SELECT * FROM notifications WHERE recipient_user_id = $1 ORDER BY created_at DESC;`;
      const res = await this.pool.query(sql, [userId]);
      return res.rows;
    }

    return this.notifications.filter((n) => n.recipient_user_id === userId);
  }

  public async markNotificationRead(notificationId: string, userId: string): Promise<boolean> {
    this.checkProductionFailClosed('markNotificationRead');
    if (this.usePostgres && this.pool) {
      const res = await this.pool.query(
        `UPDATE notifications SET read_at = NOW() WHERE id = $1 AND recipient_user_id = $2;`,
        [notificationId, userId],
      );
      return (res.rowCount || 0) > 0;
    }

    const notif = this.notifications.find((n) => n.id === notificationId && n.recipient_user_id === userId);
    if (notif) {
      notif.read_at = new Date().toISOString();
      return true;
    }
    return false;
  }

  public async createNotification(notif: {
    id: string;
    recipient_user_id: string;
    type: string;
    title: string;
    body: string;
    created_at: string;
  }): Promise<any> {
    this.checkProductionFailClosed('createNotification');
    if (this.usePostgres && this.pool) {
      const sql = `
        INSERT INTO notifications (id, recipient_user_id, type, title, body, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
      const res = await this.pool.query(sql, [
        notif.id,
        notif.recipient_user_id,
        notif.type,
        notif.title,
        notif.body,
        notif.created_at,
      ]);
      return res.rows[0];
    }

    this.notifications.unshift(notif);
    return notif;
  }

  // =========================================================================
  // AUDIT LOGS & SECURITY EVENTS — POSTGRESQL RETRIEVAL
  // =========================================================================

  public async getAuditLogs(options: {
    eventType?: string;
    actorId?: string;
    orgId?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ items: any[]; total: number }> {
    this.checkProductionFailClosed('getAuditLogs');
    if (this.usePostgres && this.pool) {
      const conditions: string[] = [];
      const values: any[] = [];
      let idx = 1;

      if (options.eventType) {
        conditions.push(`event_type = $${idx++}`);
        values.push(options.eventType);
      }
      if (options.actorId) {
        conditions.push(`actor_user_id = $${idx++}`);
        values.push(options.actorId);
      }
      if (options.orgId) {
        conditions.push(`organization_id = $${idx++}`);
        values.push(options.orgId);
      }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      const countRes = await this.pool.query(`SELECT COUNT(*) FROM audit_logs ${where};`, values);
      const total = parseInt(countRes.rows[0]?.count || '0', 10);

      const limit = options.limit || 50;
      const offset = options.offset || 0;
      const itemsRes = await this.pool.query(
        `SELECT * FROM audit_logs ${where} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++};`,
        [...values, limit, offset],
      );

      return { items: itemsRes.rows, total };
    }

    let logs = [...this.auditLogs];
    if (options.eventType) logs = logs.filter((l) => l.event_type === options.eventType);
    if (options.actorId) logs = logs.filter((l) => l.actor_user_id === options.actorId);
    if (options.orgId) logs = logs.filter((l) => l.organization_id === options.orgId);
    const total = logs.length;
    const limit = options.limit || 50;
    const offset = options.offset || 0;
    return { items: logs.slice(offset, offset + limit), total };
  }

  public async getSecurityEvents(severity?: string): Promise<any[]> {
    this.checkProductionFailClosed('getSecurityEvents');
    if (this.usePostgres && this.pool) {
      if (severity) {
        const res = await this.pool.query(
          `SELECT * FROM security_events WHERE severity = $1 ORDER BY created_at DESC;`,
          [severity],
        );
        return res.rows;
      }
      const res = await this.pool.query(`SELECT * FROM security_events ORDER BY created_at DESC;`);
      return res.rows;
    }

    if (severity) {
      return this.securityEvents.filter((e) => e.severity === severity);
    }
    return [...this.securityEvents];
  }

  public async getSecurityEventById(id: string): Promise<any | null> {
    this.checkProductionFailClosed('getSecurityEventById');
    if (this.usePostgres && this.pool) {
      const res = await this.pool.query(`SELECT * FROM security_events WHERE id = $1 LIMIT 1;`, [id]);
      return res.rows[0] || null;
    }

    return this.securityEvents.find((e) => e.id === id) || null;
  }

  public async resolveSecurityEvent(id: string, resolvedBy: string): Promise<any> {
    this.checkProductionFailClosed('resolveSecurityEvent');
    if (this.usePostgres && this.pool) {
      const res = await this.pool.query(
        `UPDATE security_events SET resolved_at = NOW(), resolved_by = $1 WHERE id = $2 RETURNING *;`,
        [resolvedBy, id],
      );
      return res.rows[0] || null;
    }

    const event = this.securityEvents.find((e) => e.id === id);
    if (event) {
      event.resolved_at = new Date().toISOString();
      event.resolved_by = resolvedBy;
    }
    return event || null;
  }

  // =========================================================================
  // SYNCHRONOUS BACKWARDS-COMPATIBILITY HELPERS FOR DEV/TEST FIXTURES
  // =========================================================================

  public getCasesByOrg(organizationId: string) {
    return this.cases.filter((c) => c.organization_id === organizationId);
  }

  public getCaseByIdAndOrg(caseId: string, organizationId?: string) {
    if (organizationId) {
      return this.cases.find((c) => c.id === caseId && c.organization_id === organizationId);
    }
    return this.cases.find((c) => c.id === caseId);
  }

  public getDocumentsByCaseSync(caseId: string) {
    return this.documents.filter((d) => d.case_id === caseId && d.status !== 'deleted');
  }

  public getDocumentByIdSync(documentId: string) {
    return this.documents.find((d) => d.id === documentId && d.status !== 'deleted');
  }

  public getUserByIdSync(userId: string) {
    return this.users.find((u) => u.id === userId);
  }

  public getUserByEmailSync(email: string) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public getOrgByIdSync(orgId: string) {
    return this.organizations.find((o) => o.id === orgId);
  }

  public getUserRoleSync(userId: string) {
    const ur = this.userRoles.find((r) => r.user_id === userId);
    if (!ur) return null;
    return this.roles.find((r) => r.id === ur.role_id) || null;
  }

  public getUserOrgSync(userId: string) {
    const mem = this.organizationMemberships.find(
      (m) => m.user_id === userId && m.status === 'active' && !m.revoked_at,
    );
    if (!mem) return null;
    return this.organizations.find((o) => o.id === mem.organization_id) || null;
  }
}

export const db = DatabaseService.getInstance();

