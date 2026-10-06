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

export const logAuditEvent = (params: AuditParams) => {
  const auditRecord = {
    id: uuidv4(),
    actor_user_id: params.actorUserId || null,
    organization_id: params.organizationId || null,
    event_type: params.eventType,
    action: params.action,
    resource_type: params.resourceType,
    resource_id: params.resourceId || null,
    result: params.result,
    request_id: params.requestId,
    created_at: new Date().toISOString(),
    // Never include sensitive fields in metadata
    metadata: params.metadata || {},
  };

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
