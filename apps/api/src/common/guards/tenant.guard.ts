import { Response, NextFunction } from 'express';
import { AppRequest } from '../types';
import { AppError } from '../filters/error.filter';

export const isPanaceaInternalRole = (role: string): boolean => {
  return [
    'platform_super_admin',
    'security_compliance_admin',
    'operations_admin',
    'panacea_legal_recovery_user',
    'panacea_investigation_user',
  ].includes(role);
};

export const requireTenantAccess = (targetOrgIdGetter: (req: AppRequest) => string | undefined) => {
  return (req: AppRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 'UNAUTHORIZED', 401));
    }

    const targetOrgId = targetOrgIdGetter(req);
    if (!targetOrgId) {
      return next();
    }

    // Panacea operations roles can access client dockets when authorized
    if (isPanaceaInternalRole(req.user.role)) {
      return next();
    }

    // Client roles MUST match their own organization ID
    if (req.user.organization_id !== targetOrgId) {
      // Return 403 (or 404 to avoid tenant existence enumeration)
      return next(
        new AppError(
          'Resource not found or access denied across organization boundary.',
          'FORBIDDEN',
          403,
        ),
      );
    }

    next();
  };
};
