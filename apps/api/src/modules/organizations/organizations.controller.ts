import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../database/db';
import { AppRequest } from '../../common/types';
import { AppError } from '../../common/filters/error.filter';
import { requireAuth } from '../../common/guards/auth.guard';
import { requireRoles } from '../../common/guards/rbac.guard';
import { isPanaceaInternalRole } from '../../common/guards/tenant.guard';
import { logAuditEvent } from '../../common/middleware/audit';

const router = Router();

/**
 * GET /organizations
 * List organizations (internal staff see all, clients see their own)
 */
router.get('/', requireAuth, (req: AppRequest, res: Response) => {
  const isInternal = isPanaceaInternalRole(req.user!.role);
  const orgList = isInternal
    ? db.organizations
    : db.organizations.filter((o) => o.id === req.user!.organization_id);

  return res.status(200).json({
    data: orgList,
    requestId: req.requestId,
  });
});

/**
 * GET /organizations/:id
 */
router.get('/:id', requireAuth, (req: AppRequest, res: Response, next) => {
  const id = req.params.id as string;
  const isInternal = isPanaceaInternalRole(req.user!.role);

  if (!isInternal && req.user!.organization_id !== id) {
    return next(new AppError('Organization not found.', 'NOT_FOUND', 404));
  }

  const org = db.getOrgById(id);
  if (!org) {
    return next(new AppError('Organization not found.', 'NOT_FOUND', 404));
  }

  return res.status(200).json({
    data: org,
    requestId: req.requestId,
  });
});

/**
 * GET /organizations/:id/users
 */
router.get('/:id/users', requireAuth, (req: AppRequest, res: Response, next) => {
  const { id } = req.params;
  const isInternal = isPanaceaInternalRole(req.user!.role);

  if (!isInternal && req.user!.organization_id !== id) {
    return next(new AppError('Organization not found.', 'NOT_FOUND', 404));
  }

  const memberUserIds = db.organizationMemberships
    .filter((m) => m.organization_id === id && m.status === 'active' && !m.revoked_at)
    .map((m) => m.user_id);

  const orgUsers = db.users
    .filter((u) => memberUserIds.includes(u.id))
    .map((u) => ({
      id: u.id,
      email: u.email,
      displayName: u.display_name,
      status: u.status,
      lastLoginAt: u.last_login_at,
    }));

  return res.status(200).json({
    data: orgUsers,
    requestId: req.requestId,
  });
});

/**
 * Admin endpoints:
 * POST /admin/organizations
 */
router.post(
  '/',
  requireAuth,
  requireRoles(['platform_super_admin', 'operations_admin']),
  (req: AppRequest, res: Response, next) => {
    const { legalName } = req.body;
    if (!legalName) {
      return next(new AppError('Legal name is required.', 'VALIDATION_ERROR', 400));
    }

    const newOrg = {
      id: uuidv4(),
      legal_name: legalName,
      status: 'active' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.organizations.push(newOrg);

    logAuditEvent({
      actorUserId: req.user!.id,
      eventType: 'ORGANIZATION_CREATED',
      action: 'CREATE',
      resourceType: 'ORGANIZATION',
      resourceId: newOrg.id,
      result: 'success',
      requestId: req.requestId,
      metadata: { legalName },
    });

    return res.status(201).json({
      data: newOrg,
      requestId: req.requestId,
    });
  },
);

/**
 * POST /admin/organizations/:id/suspend
 */
router.post(
  '/:id/suspend',
  requireAuth,
  requireRoles(['platform_super_admin']),
  (req: AppRequest, res: Response, next) => {
    const id = req.params.id as string;
    const org = db.getOrgById(id);

    if (!org) {
      return next(new AppError('Organization not found.', 'NOT_FOUND', 404));
    }

    org.status = 'suspended';
    org.updated_at = new Date().toISOString();

    logAuditEvent({
      actorUserId: req.user!.id,
      eventType: 'ORGANIZATION_SUSPENDED',
      action: 'SUSPEND',
      resourceType: 'ORGANIZATION',
      resourceId: id,
      result: 'success',
      requestId: req.requestId,
    });

    return res.status(200).json({
      data: org,
      requestId: req.requestId,
    });
  },
);

export default router;
