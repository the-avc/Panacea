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
  async (req: AppRequest, res: Response, next) => {
    try {
      const { eventType, actorId, orgId, page = '1', pageSize = '50' } = req.query;

      const p = Math.max(1, parseInt(page as string, 10) || 1);
      const ps = Math.min(100, Math.max(1, parseInt(pageSize as string, 10) || 50));
      const offset = (p - 1) * ps;

      const result = await db.getAuditLogs({
        eventType: typeof eventType === 'string' ? eventType : undefined,
        actorId: typeof actorId === 'string' ? actorId : undefined,
        orgId: typeof orgId === 'string' ? orgId : undefined,
        limit: ps,
        offset,
      });

      return res.status(200).json({
        data: {
          items: result.items,
          pagination: {
            page: p,
            pageSize: ps,
            totalItems: result.total,
            totalPages: Math.ceil(result.total / ps),
          },
        },
        requestId: req.requestId,
      });
    } catch (err) {
      return next(err);
    }
  },
);

/**
 * GET /admin/security-events
 */
router.get(
  '/security-events',
  requireAuth,
  requireRoles(['platform_super_admin', 'security_compliance_admin']),
  async (req: AppRequest, res: Response, next) => {
    try {
      const { severity } = req.query;
      const events = await db.getSecurityEvents(typeof severity === 'string' ? severity : undefined);

      return res.status(200).json({
        data: events,
        requestId: req.requestId,
      });
    } catch (err) {
      return next(err);
    }
  },
);

/**
 * GET /admin/security-events/:id
 */
router.get(
  '/security-events/:id',
  requireAuth,
  requireRoles(['platform_super_admin', 'security_compliance_admin']),
  async (req: AppRequest, res: Response, next) => {
    try {
      const id = req.params.id as string;
      const event = await db.getSecurityEventById(id);

      if (!event) {
        return next(new AppError('Security incident event not found.', 'NOT_FOUND', 404));
      }

      return res.status(200).json({
        data: event,
        requestId: req.requestId,
      });
    } catch (err) {
      return next(err);
    }
  },
);

/**
 * POST /admin/security-events/:id/resolve
 */
router.post(
  '/security-events/:id/resolve',
  requireAuth,
  requireRoles(['platform_super_admin', 'security_compliance_admin']),
  async (req: AppRequest, res: Response, next) => {
    try {
      const id = req.params.id as string;
      const event = await db.getSecurityEventById(id);

      if (!event) {
        return next(new AppError('Security incident event not found.', 'NOT_FOUND', 404));
      }

      const resolved = await db.resolveSecurityEvent(id, req.user!.id);

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
        data: resolved,
        requestId: req.requestId,
      });
    } catch (err) {
      return next(err);
    }
  },
);

export default router;
