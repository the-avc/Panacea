import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../database/db';

export interface AuditParams {
  actorUserId?: string | null;
  organizationId?: string | null;
  eventType: string;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  result: 'success' | 'denied' | 'failure';
  requestId: string;
  metadata?: Record<string, any>;
}

export interface AuditRecord {
  id: string;
  actor_user_id: string | null;
  organization_id: string | null;
  event_type: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  result: 'success' | 'denied' | 'failure';
  request_id: string;
  created_at: string;
  previous_hash: string;
  hash: string;
  metadata: Record<string, any>;
}

export const GENESIS_PREVIOUS_HASH =
  '0000000000000000000000000000000000000000000000000000000000000000';

/**
 * Computes canonical cryptographic SHA-256 hash for an audit record
 */
export function computeAuditRecordHash(record: {
  id: string;
  actor_user_id: string | null;
  organization_id: string | null;
  event_type: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  result: string;
  request_id: string;
  created_at: string;
  previous_hash: string;
}): string {
  // Canonical representation ensures deterministic serialization across environments
  const canonicalPayload = JSON.stringify({
    id: record.id,
    actor_user_id: record.actor_user_id,
    organization_id: record.organization_id,
    event_type: record.event_type,
    action: record.action,
    resource_type: record.resource_type,
    resource_id: record.resource_id,
    result: record.result,
    request_id: record.request_id,
    created_at: record.created_at,
    previous_hash: record.previous_hash,
  });

  return crypto.createHash('sha256').update(canonicalPayload).digest('hex');
}

/**
 * Appends a tamper-evident cryptographically chained audit log entry
 */
export const logAuditEvent = (params: AuditParams): AuditRecord => {
  // Retrieve previous record's hash to maintain hash-chain continuity
  const previousRecord = db.auditLogs.length > 0 ? db.auditLogs[0] : null;
  const previousHash = previousRecord?.hash || GENESIS_PREVIOUS_HASH;

  const id = uuidv4();
  const createdAt = new Date().toISOString();

  const coreFields = {
    id,
    actor_user_id: params.actorUserId || null,
    organization_id: params.organizationId || null,
    event_type: params.eventType,
    action: params.action,
    resource_type: params.resourceType,
    resource_id: params.resourceId || null,
    result: params.result,
    request_id: params.requestId,
    created_at: createdAt,
    previous_hash: previousHash,
  };

  const hash = computeAuditRecordHash(coreFields);

  const auditRecord: AuditRecord = {
    ...coreFields,
    hash,
    // Sensitive authentication tokens and private content must never be logged
    metadata: params.metadata || {},
  };

  // Add to head of log array for chronological query access
  db.auditLogs.unshift(auditRecord);
  return auditRecord;
};

export const logSecurityEvent = (params: {
  userId?: string | null;
  organizationId?: string | null;
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  sourceIp?: string | null;
  requestId?: string | null;
  details?: Record<string, any>;
}) => {
  const event = {
    id: uuidv4(),
    user_id: params.userId || null,
    organization_id: params.organizationId || null,
    event_type: params.eventType,
    severity: params.severity,
    source_ip: params.sourceIp || '127.0.0.1',
    request_id: params.requestId || null,
    details: params.details || {},
    created_at: new Date().toISOString(),
    resolved_at: null,
    resolved_by: null,
  };

  db.securityEvents.unshift(event);
  return event;
};

/**
 * Cryptographic Audit Log Integrity Verification Tool
 *
 * Verifies:
 * 1. That every log entry's canonical SHA-256 hash matches its stored hash
 * 2. That every record correctly links to the preceding entry's hash
 * Returns detection details upon any detected tampering or insertion
 */
export function verifyAuditLogIntegrity(
  logs: AuditRecord[],
): { valid: boolean; compromisedAtIndex?: number; reason?: string } {
  if (!logs || logs.length === 0) {
    return { valid: true };
  }

  // Iterate chronologically (oldest to newest: from index logs.length - 1 down to 0)
  const chronological = [...logs].reverse();

  for (let i = 0; i < chronological.length; i++) {
    const record = chronological[i];
    if (!record) continue;

    // Verify self-integrity hash
    const computedHash = computeAuditRecordHash(record);
    if (computedHash !== record.hash) {
      return {
        valid: false,
        compromisedAtIndex: logs.length - 1 - i,
        reason: `Hash mismatch at record ID ${record.id}: expected ${computedHash}, got ${record.hash}`,
      };
    }

    // Verify hash chaining to prior record
    if (i === 0) {
      if (record.previous_hash !== GENESIS_PREVIOUS_HASH) {
        return {
          valid: false,
          compromisedAtIndex: logs.length - 1 - i,
          reason: `Genesis record ID ${record.id} does not link to GENESIS_PREVIOUS_HASH`,
        };
      }
    } else {
      const priorRecord = chronological[i - 1];
      if (!priorRecord || record.previous_hash !== priorRecord.hash) {
        return {
          valid: false,
          compromisedAtIndex: logs.length - 1 - i,
          reason: `Broken chain at record ID ${record.id}: previous_hash ${record.previous_hash} does not match prior record hash ${priorRecord?.hash}`,
        };
      }
    }
  }

  return { valid: true };
}
