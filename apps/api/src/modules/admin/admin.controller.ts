import { Router, Response } from 'express';
import { db } from '../../database/db';
import { AppRequest } from '../../common/types';
import { AppError } from '../../common/filters/error.filter';
import { requireAuth } from '../../common/guards/auth.guard';
import { requireRoles } from '../../common/guards/rbac.guard';
import { logAuditEvent } from '../../common/middleware/audit';

const router = Router();

/**
 * GET /admin/audit-logs
 * Authorized for security admin and platform super admin only
 */
router.get(
  '/audit-logs',
  requireAuth,
  requireRoles(['platform_super_admin', 'security_compliance_admin']),
  (req: AppRequest, res: Response) => {
    const { eventType, actorId, orgId, page = '1', pageSize = '50' } = req.query;

    let logs = [...db.auditLogs];

    if (eventType && typeof eventType === 'string') {
      logs = logs.filter((l) => l.event_type === eventType);
    }
    if (actorId && typeof actorId === 'string') {
      logs = logs.filter((l) => l.actor_user_id === actorId);
    }
    if (orgId && typeof orgId === 'string') {
      logs = logs.filter((l) => l.organization_id === orgId);
    }

    const p = Math.max(1, parseInt(page as string, 10) || 1);
    const ps = Math.min(100, Math.max(1, parseInt(pageSize as string, 10) || 50));
    const total = logs.length;
    const paginated = logs.slice((p - 1) * ps, p * ps);

    return res.status(200).json({
      data: {
        items: paginated,
        pagination: {
          page: p,
          pageSize: ps,
          totalItems: total,
          totalPages: Math.ceil(total / ps),
        },
      },
      requestId: req.requestId,
    });
  },
);

/**
 * GET /admin/security-events
 */
router.get(
  '/security-events',
  requireAuth,
  requireRoles(['platform_super_admin', 'security_compliance_admin']),
  (req: AppRequest, res: Response) => {
    const { severity } = req.query;

    let events = [...db.securityEvents];
    if (severity && typeof severity === 'string') {
      events = events.filter((e) => e.severity === severity);
    }

    return res.status(200).json({
      data: events,
      requestId: req.requestId,
    });
  },
);

/**
 * GET /admin/security-events/:id
 */
router.get(
  '/security-events/:id',
  requireAuth,
  requireRoles(['platform_super_admin', 'security_compliance_admin']),
  (req: AppRequest, res: Response, next) => {
    const { id } = req.params;
    const event = db.securityEvents.find((e) => e.id === id);

    if (!event) {
      return next(new AppError('Security incident event not found.', 'NOT_FOUND', 404));
    }

    return res.status(200).json({
      data: event,
      requestId: req.requestId,
    });
  },
);

/**
 * POST /admin/security-events/:id/resolve
 */
router.post(
  '/security-events/:id/resolve',
  requireAuth,
  requireRoles(['platform_super_admin', 'security_compliance_admin']),
  (req: AppRequest, res: Response, next) => {
    const id = req.params.id as string;
    const event = db.securityEvents.find((e) => e.id === id);

    if (!event) {
      return next(new AppError('Security incident event not found.', 'NOT_FOUND', 404));
    }

    event.resolved_at = new Date().toISOString();
    event.resolved_by = req.user!.id;

    logAuditEvent({
      actorUserId: req.user!.id,
      eventType: 'SECURITY_EVENT_RESOLVED',
      action: 'RESOLVE',
      resourceType: 'SECURITY_EVENT',
      resourceId: id,
      result: 'success',
      requestId: req.requestId,
    });

    return res.status(200).json({
      data: event,
      requestId: req.requestId,
    });
  },
);

export default router;
