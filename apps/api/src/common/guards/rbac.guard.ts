import { Response, NextFunction } from 'express';
import { AppRequest } from '../types';
import { AppError } from '../filters/error.filter';
import { logAuditEvent } from '../middleware/audit';

/**
 * Role-Based Access Control (RBAC) Guard
 *
 * Enforces:
 * 1. Default-deny privilege enforcement
 * 2. Explicit audit trails for super-admin execution (no invisible bypasses)
 */
export const requireRoles = (allowedRoles: string[]) => {
  return (req: AppRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 'UNAUTHORIZED', 401));
    }

    // Super admin role check with required audit logging
    if (req.user.role === 'platform_super_admin') {
      logAuditEvent({
        actorUserId: req.user.id,
        organizationId: req.user.organization_id,
        eventType: 'SUPER_ADMIN_PRIVILEGED_OPERATION',
        action: req.method,
        resourceType: 'API_ENDPOINT',
        resourceId: req.originalUrl || req.path,
        result: 'success',
        requestId: req.requestId,
        metadata: {
          path: req.originalUrl || req.path,
          method: req.method,
          requiredRoles: allowedRoles,
        },
      });
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          'You do not possess the required security privileges for this operation.',
          'FORBIDDEN',
          403,
        ),
      );
    }

    next();
  };
};
