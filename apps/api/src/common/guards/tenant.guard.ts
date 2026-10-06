import { Response, NextFunction } from 'express';
import { AppRequest } from '../types';
import { AppError } from '../filters/error.filter';
import { logAuditEvent } from '../middleware/audit';
import { db } from '../../database/db';

export const isPanaceaInternalRole = (role: string): boolean => {
  return [
    'platform_super_admin',
    'security_compliance_admin',
    'operations_admin',
    'panacea_legal_recovery_user',
    'panacea_investigation_user',
  ].includes(role);
};

export const isPanaceaOversightRole = (role: string): boolean => {
  return [
    'platform_super_admin',
    'security_compliance_admin',
    'operations_admin',
  ].includes(role);
};

/**
 * Tenant Isolation & Operational Scope Guard
 *
 * Enforces:
 * 1. Client users are strictly isolated to their own organization
 * 2. Panacea administrative roles are logged with explicit audit trails for cross-tenant operations
 * 3. Operational staff (legal/investigation) require case assignment or valid mandate
 */
export const requireTenantAccess = (targetOrgIdGetter: (req: AppRequest) => string | undefined) => {
  return async (req: AppRequest, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required.', 'UNAUTHORIZED', 401));
      }

      const targetOrgId = targetOrgIdGetter(req);
      if (!targetOrgId) {
        return next();
      }

      // Client roles MUST strictly match their own organization ID
      if (!isPanaceaInternalRole(req.user.role)) {
        if (req.user.organization_id !== targetOrgId) {
          // Return 404 to prevent resource existence enumeration across tenant boundaries
          return next(
            new AppError(
              'Resource not found or access denied across organization boundary.',
              'NOT_FOUND',
              404,
            ),
          );
        }
        return next();
      }

      // Panacea oversight roles (Super Admin, Operations Admin, Security Admin)
      if (isPanaceaOversightRole(req.user.role)) {
        if (req.user.organization_id !== targetOrgId) {
          logAuditEvent({
            actorUserId: req.user.id,
            organizationId: targetOrgId,
            eventType: 'ADMIN_CROSS_TENANT_ACCESS',
            action: 'ACCESS',
            resourceType: 'ORGANIZATION',
            resourceId: targetOrgId,
            result: 'success',
            requestId: req.requestId,
            metadata: { actorRole: req.user.role },
          });
        }
        return next();
      }

      // Operational staff (Legal Recovery & Investigation Specialists)
      // Check specific docket assignment when case ID is present in route
      const caseId = (req.params.caseId || req.params.id) as string;
      if (caseId) {
        const isAssigned = await db.isCaseAssignedToUser(caseId, req.user.id);
        const caseExists = await db.getCaseById(caseId, targetOrgId);

        if (!caseExists) {
          return next(new AppError('Case docket not found.', 'NOT_FOUND', 404));
        }

        if (!isAssigned) {
          // Log access under institutional service mandate
          logAuditEvent({
            actorUserId: req.user.id,
            organizationId: targetOrgId,
            eventType: 'OPERATIONAL_STAFF_ACCESS',
            action: 'ACCESS',
            resourceType: 'CASE',
            resourceId: caseId,
            result: 'success',
            requestId: req.requestId,
            metadata: { actorRole: req.user.role, assigned: false },
          });
        }
      }

      next();
    } catch (err) {
      return next(err);
    }
  };
};
