import { v4 as uuidv4 } from 'uuid';

/**
 * PANACEA CONSULTANCY — Seed Data & Test Fixture Configuration
 *
 * Implements strict environment isolation:
 * - In production: NO default accounts, NO demo accounts, NO demo orgs, NO demo cases,
 *   NO demo documents, NO demo MFA factors, NO hardcoded passwords.
 *   Production database bootstrapping requires explicit administrative enrollment.
 * - In test/dev: Isolated individual credentials loaded from environment variables or test fixtures.
 */

const isProd = process.env.NODE_ENV === 'production';

// Structurally empty in production
export const SEED_ORGS: Record<string, any> = isProd
  ? {}
  : {
      panacea: {
        id: '11111111-1111-1111-1111-111111111111',
        legal_name: 'Panacea Consultancy Private Limited',
        status: 'active' as const,
      },
      icici: {
        id: '22222222-2222-2222-2222-222222222222',
        legal_name: 'ICICI Bank Limited',
        status: 'active' as const,
      },
      axis: {
        id: '33333333-3333-3333-3333-333333333333',
        legal_name: 'Axis Bank Limited',
        status: 'active' as const,
      },
      bajaj: {
        id: '44444444-4444-4444-4444-444444444444',
        legal_name: 'Bajaj General Insurance Co. Ltd.',
        status: 'active' as const,
      },
    };

export const SEED_ROLES: Record<string, any> = isProd
  ? {}
  : {
      platformSuperAdmin: {
        id: 'a0000000-0000-0000-0000-000000000001',
        name: 'platform_super_admin',
        description: 'Platform Super Administrator with complete system authority',
      },
      securityAdmin: {
        id: 'a0000000-0000-0000-0000-000000000002',
        name: 'security_compliance_admin',
        description: 'Security & Compliance Administrator for audit and incident monitoring',
      },
      operationsAdmin: {
        id: 'a0000000-0000-0000-0000-000000000003',
        name: 'operations_admin',
        description: 'Operations Administrator managing dockets and institutional assignments',
      },
      panaceaLegalUser: {
        id: 'a0000000-0000-0000-0000-000000000004',
        name: 'panacea_legal_recovery_user',
        description: 'Panacea Enforcement & Legal Recovery Specialist',
      },
      institutionalClientAdmin: {
        id: 'a0000000-0000-0000-0000-000000000005',
        name: 'institutional_client_admin',
        description: 'Institutional Client Administrator managing bank users and viewing org cases',
      },
      institutionalClientUser: {
        id: 'a0000000-0000-0000-0000-000000000006',
        name: 'institutional_client_user',
        description: 'Institutional Client Representative accessing assigned organization cases',
      },
      panaceaInvestigationUser: {
        id: 'a0000000-0000-0000-0000-000000000007',
        name: 'panacea_investigation_user',
        description: 'Panacea Asset Verification & Third-Party Investigation Specialist',
      },
    };

export const SEED_PERMISSIONS = isProd
  ? []
  : [
      { id: uuidv4(), resource: 'case', action: 'read' },
      { id: uuidv4(), resource: 'case', action: 'create' },
      { id: uuidv4(), resource: 'case', action: 'update' },
      { id: uuidv4(), resource: 'case', action: 'change_status' },
      { id: uuidv4(), resource: 'case', action: 'assign' },
      { id: uuidv4(), resource: 'document', action: 'read' },
      { id: uuidv4(), resource: 'document', action: 'upload' },
      { id: uuidv4(), resource: 'document', action: 'download' },
      { id: uuidv4(), resource: 'document', action: 'delete' },
      { id: uuidv4(), resource: 'user', action: 'read' },
      { id: uuidv4(), resource: 'user', action: 'create' },
      { id: uuidv4(), resource: 'user', action: 'disable' },
      { id: uuidv4(), resource: 'organization', action: 'read' },
      { id: uuidv4(), resource: 'organization', action: 'update' },
      { id: uuidv4(), resource: 'audit', action: 'read' },
      { id: uuidv4(), resource: 'security_event', action: 'read' },
      { id: uuidv4(), resource: 'role', action: 'assign' },
    ];

import crypto from 'crypto';

/**
 * Generates a high-entropy cryptographically secure random password adhering to strong password policy.
 * Contains uppercase, lowercase, numbers, and symbols.
 * ZERO hardcoded passwords in source code.
 */
function generateRandomPassword(): string {
  const rand = crypto.randomBytes(9).toString('base64').replace(/[^a-zA-Z0-9]/g, 'x');
  return `Pnc#${rand}!9`;
}

/**
 * Generates a standard Base32 TOTP secret (RFC 4648) dynamically.
 * ZERO hardcoded TOTP secrets in source code.
 */
function generateRandomTotpSecret(): string {
  const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  const bytes = crypto.randomBytes(16);
  for (let i = 0; i < 16; i++) {
    secret += base32Chars[(bytes[i] ?? 0) % base32Chars.length];
  }
  return secret;
}

let memoizedTestCredentials: any = null;

/**
 * Test credentials for development / CI environments ONLY.
 * Loaded from environment variables (e.g. .env.test.local) or generated dynamically at runtime.
 * In production, this object throws a fatal error if accessed.
 */
function createTestCredentials() {
  if (isProd) {
    throw new Error('[SECURITY] TEST_CREDENTIALS cannot be accessed in production environment.');
  }

  if (memoizedTestCredentials) {
    return memoizedTestCredentials;
  }

  memoizedTestCredentials = {
    superAdmin: {
      email: process.env.TEST_SUPERADMIN_EMAIL || 'admin@panaceaconsultancy.in',
      password: process.env.TEST_SUPERADMIN_PASSWORD || generateRandomPassword(),
      totpSecret: process.env.TEST_SUPERADMIN_TOTP_SECRET || generateRandomTotpSecret(),
    },
    directorPrashant: {
      email: process.env.TEST_PRASHANT_EMAIL || 'prashant.kumar@panaceaconsultancy.com',
      password: process.env.TEST_PRASHANT_PASSWORD || generateRandomPassword(),
      totpSecret: process.env.TEST_PRASHANT_TOTP_SECRET || generateRandomTotpSecret(),
    },
    directorAnjana: {
      email: process.env.TEST_ANJANA_EMAIL || 'anjana.singh@panaceaconsultancy.com',
      password: process.env.TEST_ANJANA_PASSWORD || generateRandomPassword(),
      totpSecret: process.env.TEST_ANJANA_TOTP_SECRET || generateRandomTotpSecret(),
    },
    securityOfficer: {
      email: process.env.TEST_SECURITY_EMAIL || 'security@panaceaconsultancy.in',
      password: process.env.TEST_SECURITY_PASSWORD || generateRandomPassword(),
      totpSecret: process.env.TEST_SECURITY_TOTP_SECRET || generateRandomTotpSecret(),
    },
    legalOfficer: {
      email: process.env.TEST_LEGAL_EMAIL || 'legal.officer@panaceaconsultancy.in',
      password: process.env.TEST_LEGAL_PASSWORD || generateRandomPassword(),
      totpSecret: process.env.TEST_LEGAL_TOTP_SECRET || generateRandomTotpSecret(),
    },
    investigationOfficer: {
      email: process.env.TEST_INVESTIGATION_EMAIL || 'investigation@panaceaconsultancy.in',
      password: process.env.TEST_INVESTIGATION_PASSWORD || generateRandomPassword(),
      totpSecret: process.env.TEST_INVESTIGATION_TOTP_SECRET || generateRandomTotpSecret(),
    },
    iciciAdmin: {
      email: process.env.TEST_ICICI_EMAIL || 'nodal.officer@icicibank.com',
      password: process.env.TEST_ICICI_PASSWORD || generateRandomPassword(),
      totpSecret: process.env.TEST_ICICI_TOTP_SECRET || generateRandomTotpSecret(),
    },
    axisUser: {
      email: process.env.TEST_AXIS_EMAIL || 'recovery.desk@axisbank.com',
      password: process.env.TEST_AXIS_PASSWORD || generateRandomPassword(),
      totpSecret: process.env.TEST_AXIS_TOTP_SECRET || generateRandomTotpSecret(),
    },
  };

  return memoizedTestCredentials;
}

export function getDevTestCredentials(): any {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('[SECURITY] getDevTestCredentials() is forbidden in production.');
  }
  return createTestCredentials();
}

export const TEST_CREDENTIALS: any = new Proxy(
  {},
  {
    get(_target, prop: string) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(
          `[SECURITY] TEST_CREDENTIALS.${prop} is forbidden in production. Production must use real provisioning.`,
        );
      }
      const creds = createTestCredentials();
      return (creds as any)[prop];
    },
    ownKeys(_target) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('[SECURITY] TEST_CREDENTIALS is forbidden in production.');
      }
      return Reflect.ownKeys(createTestCredentials());
    },
    getOwnPropertyDescriptor(_target, prop) {
      return Object.getOwnPropertyDescriptor(createTestCredentials(), prop);
    },
  },
);

// In production, SEED_USERS is empty. Production bootstrap uses explicit administrative invitation.
export const SEED_USERS: Record<string, any> = isProd
  ? {}
  : {
      directorPrashant: {
        id: 'u1111111-1111-1111-1111-111111111111',
        email: TEST_CREDENTIALS.directorPrashant.email,
        display_name: 'Mr. Prashant Kumar (Managing Director)',
        password_hash: null, // Dynamically computed via Argon2 in dev/test runtime
        status: 'active' as const,
        org_id: SEED_ORGS.panacea.id,
        role: 'platform_super_admin',
      },
      directorAnjana: {
        id: 'u1111111-2222-2222-2222-111111111111',
        email: TEST_CREDENTIALS.directorAnjana.email,
        display_name: 'Mrs. Anjana Singh (Director — Operations)',
        password_hash: null,
        status: 'active' as const,
        org_id: SEED_ORGS.panacea.id,
        role: 'operations_admin',
      },
      superAdmin: {
        id: 'u1111111-3333-3333-3333-111111111111',
        email: TEST_CREDENTIALS.superAdmin.email,
        display_name: 'Platform Systems Administrator',
        password_hash: null,
        status: 'active' as const,
        org_id: SEED_ORGS.panacea.id,
        role: 'platform_super_admin',
      },
      securityOfficer: {
        id: 'u2222222-2222-2222-2222-222222222222',
        email: TEST_CREDENTIALS.securityOfficer.email,
        display_name: 'Compliance & Audit Officer',
        password_hash: null,
        status: 'active' as const,
        org_id: SEED_ORGS.panacea.id,
        role: 'security_compliance_admin',
      },
      legalOfficer: {
        id: 'u3333333-3333-3333-3333-333333333333',
        email: TEST_CREDENTIALS.legalOfficer.email,
        display_name: 'Adv. Rajesh Verma (Lead Enforcement Officer)',
        password_hash: null,
        status: 'active' as const,
        org_id: SEED_ORGS.panacea.id,
        role: 'panacea_legal_recovery_user',
      },
      investigationOfficer: {
        id: 'u3333333-4444-4444-4444-333333333333',
        email: TEST_CREDENTIALS.investigationOfficer.email,
        display_name: 'Suresh Pandey (Chief Investigator)',
        password_hash: null,
        status: 'active' as const,
        org_id: SEED_ORGS.panacea.id,
        role: 'panacea_investigation_user',
      },
      iciciAdmin: {
        id: 'u4444444-4444-4444-4444-444444444444',
        email: TEST_CREDENTIALS.iciciAdmin.email,
        display_name: 'Amitabh Sen (ICICI SAMG Nodal)',
        password_hash: null,
        status: 'active' as const,
        org_id: SEED_ORGS.icici.id,
        role: 'institutional_client_admin',
      },
      axisUser: {
        id: 'u5555555-5555-5555-5555-555555555555',
        email: TEST_CREDENTIALS.axisUser.email,
        display_name: 'Priya Sharma (Axis Recovery Desk)',
        password_hash: null,
        status: 'active' as const,
        org_id: SEED_ORGS.axis.id,
        role: 'institutional_client_user',
      },
    };

export const SEED_MFA_FACTORS = isProd
  ? []
  : [
      {
        id: 'mfa-superadmin',
        user_id: 'u1111111-3333-3333-3333-111111111111',
        factor_type: 'totp',
        credential_reference: TEST_CREDENTIALS.superAdmin.totpSecret,
        verified_at: new Date().toISOString(),
        revoked_at: null,
        created_at: new Date().toISOString(),
      },
      {
        id: 'mfa-director-prashant',
        user_id: 'u1111111-1111-1111-1111-111111111111',
        factor_type: 'totp',
        credential_reference: TEST_CREDENTIALS.directorPrashant.totpSecret,
        verified_at: new Date().toISOString(),
        revoked_at: null,
        created_at: new Date().toISOString(),
      },
      {
        id: 'mfa-director-anjana',
        user_id: 'u1111111-2222-2222-2222-111111111111',
        factor_type: 'totp',
        credential_reference: TEST_CREDENTIALS.directorAnjana.totpSecret,
        verified_at: new Date().toISOString(),
        revoked_at: null,
        created_at: new Date().toISOString(),
      },
      {
        id: 'mfa-security-officer',
        user_id: 'u2222222-2222-2222-2222-222222222222',
        factor_type: 'totp',
        credential_reference: TEST_CREDENTIALS.securityOfficer.totpSecret,
        verified_at: new Date().toISOString(),
        revoked_at: null,
        created_at: new Date().toISOString(),
      },
    ];

export const SEED_CASES = isProd
  ? []
  : [
      {
        id: 'c1111111-1111-1111-1111-111111111111',
        organization_id: SEED_ORGS.icici.id,
        external_reference: 'ICICI-SAR-2026-PAT-0042',
        title: 'M/s Maurya Infrastructure — Sec 14 Enforcement Docket',
        status: 'order_obtained',
        classification: 'confidential' as const,
        created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'c2222222-2222-2222-2222-222222222222',
        organization_id: SEED_ORGS.icici.id,
        external_reference: 'ICICI-SAR-2026-RNC-0108',
        title: 'Kalyan Cold Storage Pvt Ltd — Demand Notice u/s 13(2)',
        status: 'notice_served',
        classification: 'confidential' as const,
        created_at: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'c3333333-3333-3333-3333-333333333333',
        organization_id: SEED_ORGS.icici.id,
        external_reference: 'ICICI-INV-2026-BHR-0077',
        title: 'Asset Tracing & Physical Inspection — Bhagalpur Commercial Asset',
        status: 'intake',
        classification: 'restricted' as const,
        created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'c4444444-4444-4444-4444-444444444444',
        organization_id: SEED_ORGS.axis.id,
        external_reference: 'AXIS-ENF-2026-JHK-0211',
        title: 'Jamshedpur Heavy Engineering Corp — Section 14 Application',
        status: 'sec14_filing',
        classification: 'confidential' as const,
        created_at: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'c5555555-5555-5555-5555-555555555555',
        organization_id: SEED_ORGS.axis.id,
        external_reference: 'AXIS-ENF-2026-RYP-0019',
        title: 'Raipur Agro Mills — Physical Possession Execution',
        status: 'possession_taken',
        classification: 'restricted' as const,
        created_at: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      },
    ];

export const SEED_DOCUMENTS = isProd
  ? []
  : [
      {
        id: 'd1111111-1111-1111-1111-111111111111',
        case_id: 'c1111111-1111-1111-1111-111111111111',
        classification: 'confidential' as const,
        original_filename: 'DM_Patna_Section14_Order_Certified.pdf',
        storage_key: 'secure_vault/icici/c1111111/dm_order_certified_9102.pdf',
        mime_type: 'application/pdf',
        size_bytes: 2840500,
        checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        status: 'available' as const,
        uploaded_by: 'u3333333-3333-3333-3333-333333333333',
        created_at: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'd2222222-2222-2222-2222-222222222222',
        case_id: 'c2222222-2222-2222-2222-222222222222',
        classification: 'confidential' as const,
        original_filename: 'Demand_Notice_Sec13_2_Proof_of_Service.pdf',
        storage_key: 'secure_vault/icici/c2222222/sec13_2_served_proof_4401.pdf',
        mime_type: 'application/pdf',
        size_bytes: 1420100,
        checksum: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
        status: 'available' as const,
        uploaded_by: 'u3333333-3333-3333-3333-333333333333',
        created_at: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'd3333333-3333-3333-3333-333333333333',
        case_id: 'c4444444-4444-4444-4444-444444444444',
        classification: 'confidential' as const,
        original_filename: 'Affidavit_and_Section14_Application_Draft.pdf',
        storage_key: 'secure_vault/axis/c4444444/sec14_application_draft_1120.pdf',
        mime_type: 'application/pdf',
        size_bytes: 3105400,
        checksum: '4355a46b19d348dc2f57c046f8ef63d4538ebb936000f3c9ee954a27460dd865',
        status: 'available' as const,
        uploaded_by: 'u3333333-3333-3333-3333-333333333333',
        created_at: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
      },
    ];
