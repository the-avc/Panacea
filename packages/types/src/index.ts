/**
 * PANACEA CONSULTANCY — Shared Type Definitions
 *
 * These types are shared across frontend and backend applications.
 * They define the API contract and data structures.
 *
 * SECURITY NOTE: These types represent the public API contract.
 * Internal-only fields (password_hash, storage_key, etc.) must NOT
 * appear in response types — only in backend-internal entity types.
 */

// ---- Enums ----

export enum OrganizationStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  ARCHIVED = 'archived',
}

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DISABLED = 'disabled',
}

export enum CaseClassification {
  INTERNAL = 'internal',
  CONFIDENTIAL = 'confidential',
  RESTRICTED = 'restricted',
}

export enum DocumentClassification {
  CONFIDENTIAL = 'confidential',
  RESTRICTED = 'restricted',
}

export enum DocumentStatus {
  UPLOADING = 'uploading',
  SCANNING = 'scanning',
  AVAILABLE = 'available',
  QUARANTINED = 'quarantined',
  DELETED = 'deleted',
}

export enum SecurityEventSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum AuditResult {
  SUCCESS = 'success',
  DENIED = 'denied',
  FAILURE = 'failure',
}

export enum MFAFactorType {
  PASSKEY = 'passkey',
  TOTP = 'totp',
}

// ---- Case Status State Machine ----

export enum CaseStatus {
  DRAFT = 'draft',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  UNDER_REVIEW = 'under_review',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
}

/**
 * Valid case status transitions.
 * Transitions not listed here are DENIED.
 */
export const CASE_STATUS_TRANSITIONS: Record<CaseStatus, CaseStatus[]> = {
  [CaseStatus.DRAFT]: [CaseStatus.ASSIGNED],
  [CaseStatus.ASSIGNED]: [CaseStatus.IN_PROGRESS, CaseStatus.DRAFT],
  [CaseStatus.IN_PROGRESS]: [CaseStatus.UNDER_REVIEW, CaseStatus.ASSIGNED],
  [CaseStatus.UNDER_REVIEW]: [CaseStatus.RESOLVED, CaseStatus.IN_PROGRESS],
  [CaseStatus.RESOLVED]: [CaseStatus.CLOSED, CaseStatus.IN_PROGRESS],
  [CaseStatus.CLOSED]: [CaseStatus.ARCHIVED],
  [CaseStatus.ARCHIVED]: [],
};

// ---- API Response Types ----

export interface ApiResponse<T = unknown> {
  data: T;
  requestId: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    requestId: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  requestId: string;
}

// ---- Resource Types (API responses — no internal fields) ----

export interface OrganizationResponse {
  id: string;
  legalName: string;
  status: OrganizationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  id: string;
  email: string;
  displayName: string;
  status: UserStatus;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface UserProfileResponse extends UserResponse {
  organizations: Array<{
    id: string;
    legalName: string;
    role: string;
  }>;
  mfaEnabled: boolean;
  mfaFactors: Array<{
    id: string;
    type: MFAFactorType;
    label: string;
    createdAt: string;
    lastUsedAt: string | null;
  }>;
}

export interface CaseResponse {
  id: string;
  organizationId: string;
  externalReference: string | null;
  title: string;
  status: CaseStatus;
  classification: CaseClassification;
  createdAt: string;
  updatedAt: string;
}

export interface CaseDetailResponse extends CaseResponse {
  assignments: CaseAssignmentResponse[];
  statusHistory: CaseStatusHistoryResponse[];
  documentCount: number;
}

export interface CaseAssignmentResponse {
  id: string;
  userId: string | null;
  userDisplayName: string | null;
  teamReference: string | null;
  assignmentType: string;
  assignedAt: string;
  revokedAt: string | null;
}

export interface CaseStatusHistoryResponse {
  id: string;
  oldStatus: CaseStatus | null;
  newStatus: CaseStatus;
  changedByName: string;
  changedAt: string;
  reason: string | null;
}

export interface DocumentResponse {
  id: string;
  caseId: string;
  classification: DocumentClassification;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  status: DocumentStatus;
  uploadedByName: string;
  createdAt: string;
  currentVersion: number;
}

export interface DocumentVersionResponse {
  id: string;
  versionNumber: number;
  sizeBytes: number;
  checksum: string;
  uploadedByName: string;
  createdAt: string;
}

export interface NotificationResponse {
  id: string;
  type: string;
  title: string;
  body: string;
  readAt: string | null;
  createdAt: string;
}

export interface SessionResponse {
  id: string;
  deviceMetadata: Record<string, unknown> | null;
  createdAt: string;
  expiresAt: string;
  lastSeenAt: string;
  isCurrent: boolean;
}

export interface AuditLogResponse {
  id: string;
  actorUserId: string | null;
  actorDisplayName: string | null;
  organizationId: string | null;
  organizationName: string | null;
  eventType: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  result: AuditResult;
  requestId: string;
  createdAt: string;
}

export interface SecurityEventResponse {
  id: string;
  userId: string | null;
  organizationId: string | null;
  eventType: string;
  severity: SecurityEventSeverity;
  sourceIp: string | null;
  requestId: string | null;
  createdAt: string;
  resolvedAt: string | null;
  resolvedByName: string | null;
}

// ---- Auth Types ----

export interface LoginRequest {
  email: string;
  password: string;
}

export interface MFAChallengeResponse {
  challengeId: string;
  factorType: MFAFactorType;
}

export interface MFAVerifyRequest {
  challengeId: string;
  code: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetComplete {
  token: string;
  newPassword: string;
}

// ---- Request Types ----

export interface CreateCaseRequest {
  title: string;
  externalReference?: string;
  classification: CaseClassification;
}

export interface UpdateCaseRequest {
  title?: string;
  externalReference?: string;
}

export interface ChangeCaseStatusRequest {
  newStatus: CaseStatus;
  reason?: string;
}

export interface CreateCaseAssignmentRequest {
  userId?: string;
  teamReference?: string;
  assignmentType: string;
}

export interface ContactFormRequest {
  name: string;
  organization: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// ---- Pagination ----

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export const MAX_PAGE_SIZE = 100;
export const DEFAULT_PAGE_SIZE = 25;

// ---- Permissions ----

export const PERMISSIONS = {
  CASE_READ: 'case:read',
  CASE_CREATE: 'case:create',
  CASE_UPDATE: 'case:update',
  CASE_ASSIGN: 'case:assign',
  CASE_CHANGE_STATUS: 'case:change_status',
  DOCUMENT_READ: 'document:read',
  DOCUMENT_UPLOAD: 'document:upload',
  DOCUMENT_DOWNLOAD: 'document:download',
  DOCUMENT_DELETE: 'document:delete',
  USER_READ: 'user:read',
  USER_CREATE: 'user:create',
  USER_DISABLE: 'user:disable',
  ORGANIZATION_READ: 'organization:read',
  ORGANIZATION_UPDATE: 'organization:update',
  AUDIT_READ: 'audit:read',
  SECURITY_EVENT_READ: 'security_event:read',
  ROLE_ASSIGN: 'role:assign',
  NOTIFICATION_SEND: 'notification:send',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
