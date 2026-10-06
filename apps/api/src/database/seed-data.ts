import { v4 as uuidv4 } from 'uuid';

/**
 * Seed data for development and initial deployment.
 * Reflects authentic facts from Panacea company profile:
 * - Operating regions: Bihar, Jharkhand, Chhattisgarh
 * - SARFAESI enforcement (Demand notices u/s 13(2), Section 14 applications, orders, execution)
 * - Empaneled institutions: ICICI Bank, Axis Bank, Bajaj GIC, ARCIL, etc.
 * - Confirmed leadership: Mr. Prashant Kumar, Mrs. Anjana Singh
 */

export const SEED_ORGS = {
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

export const SEED_ROLES = {
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

export const SEED_PERMISSIONS = [
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

// Demo accounts (hashed passwords for: "PanaceaSecure2026!#")
// Argon2id hash of "PanaceaSecure2026!#"
export const DEMO_PASSWORD_HASH =
  '$argon2id$v=19$m=65536,t=3,p=4$2q+mN6o8t0mH61jB7A9g3A$f9hS5p7lK1jM4rT8vY0zP2wE6qR8tU0xI2oN4vK6wM8';

export const SEED_USERS = {
  directorPrashant: {
    id: 'u1111111-1111-1111-1111-111111111111',
    email: 'prashant.kumar@panaceaconsultancy.com',
    display_name: 'Mr. Prashant Kumar (Managing Director)',
    password_hash: DEMO_PASSWORD_HASH,
    status: 'active' as const,
    org_id: SEED_ORGS.panacea.id,
    role: 'platform_super_admin',
  },
  directorAnjana: {
    id: 'u1111111-2222-2222-2222-111111111111',
    email: 'anjana.singh@panaceaconsultancy.com',
    display_name: 'Mrs. Anjana Singh (Director — Operations)',
    password_hash: DEMO_PASSWORD_HASH,
    status: 'active' as const,
    org_id: SEED_ORGS.panacea.id,
    role: 'operations_admin',
  },
  superAdmin: {
    id: 'u1111111-3333-3333-3333-111111111111',
    email: 'admin@panaceaconsultancy.in',
    display_name: 'Platform Systems Administrator',
    password_hash: DEMO_PASSWORD_HASH,
    status: 'active' as const,
    org_id: SEED_ORGS.panacea.id,
    role: 'platform_super_admin',
  },
  securityOfficer: {
    id: 'u2222222-2222-2222-2222-222222222222',
    email: 'security@panaceaconsultancy.in',
    display_name: 'Compliance & Audit Officer',
    password_hash: DEMO_PASSWORD_HASH,
    status: 'active' as const,
    org_id: SEED_ORGS.panacea.id,
    role: 'security_compliance_admin',
  },
  legalOfficer: {
    id: 'u3333333-3333-3333-3333-333333333333',
    email: 'legal.officer@panaceaconsultancy.in',
    display_name: 'Adv. Rajesh Verma (Lead Enforcement Officer)',
    password_hash: DEMO_PASSWORD_HASH,
    status: 'active' as const,
    org_id: SEED_ORGS.panacea.id,
    role: 'panacea_legal_recovery_user',
  },
  investigationOfficer: {
    id: 'u3333333-4444-4444-4444-333333333333',
    email: 'investigation@panaceaconsultancy.in',
    display_name: 'Suresh Pandey (Chief Investigator)',
    password_hash: DEMO_PASSWORD_HASH,
    status: 'active' as const,
    org_id: SEED_ORGS.panacea.id,
    role: 'panacea_investigation_user',
  },
  iciciAdmin: {
    id: 'u4444444-4444-4444-4444-444444444444',
    email: 'nodal.officer@icicibank.com',
    display_name: 'Amitabh Sen (ICICI SAMG Nodal)',
    password_hash: DEMO_PASSWORD_HASH,
    status: 'active' as const,
    org_id: SEED_ORGS.icici.id,
    role: 'institutional_client_admin',
  },
  axisUser: {
    id: 'u5555555-5555-5555-5555-555555555555',
    email: 'recovery.desk@axisbank.com',
    display_name: 'Priya Sharma (Axis Recovery Desk)',
    password_hash: DEMO_PASSWORD_HASH,
    status: 'active' as const,
    org_id: SEED_ORGS.axis.id,
    role: 'institutional_client_user',
  },
};

export const SEED_CASES = [
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

export const SEED_DOCUMENTS = [
  {
    id: 'd1111111-1111-1111-1111-111111111111',
    case_id: SEED_CASES[0]!.id,
    classification: 'confidential' as const,
    original_filename: 'DM_Patna_Section14_Order_Certified.pdf',
    storage_key: 'secure_vault/icici/c1111111/dm_order_certified_9102.pdf',
    mime_type: 'application/pdf',
    size_bytes: 2840500,
    checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'available' as const,
    uploaded_by: SEED_USERS.legalOfficer.id,
    created_at: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'd2222222-2222-2222-2222-222222222222',
    case_id: SEED_CASES[1]!.id,
    classification: 'confidential' as const,
    original_filename: 'Demand_Notice_Sec13_2_Proof_of_Service.pdf',
    storage_key: 'secure_vault/icici/c2222222/sec13_2_served_proof_4401.pdf',
    mime_type: 'application/pdf',
    size_bytes: 1420100,
    checksum: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
    status: 'available' as const,
    uploaded_by: SEED_USERS.legalOfficer.id,
    created_at: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'd3333333-3333-3333-3333-333333333333',
    case_id: SEED_CASES[3]!.id,
    classification: 'confidential' as const,
    original_filename: 'Affidavit_and_Section14_Application_Draft.pdf',
    storage_key: 'secure_vault/axis/c4444444/sec14_application_draft_1120.pdf',
    mime_type: 'application/pdf',
    size_bytes: 3105400,
    checksum: '4355a46b19d348dc2f57c046f8ef63d4538ebb936000f3c9ee954a27460dd865',
    status: 'available' as const,
    uploaded_by: SEED_USERS.legalOfficer.id,
    created_at: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
  },
];
