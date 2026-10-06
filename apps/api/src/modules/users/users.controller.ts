import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../database/db';
import { AppRequest } from '../../common/types';
import { AppError } from '../../common/filters/error.filter';
import { requireAuth } from '../../common/guards/auth.guard';
import { requireRoles } from '../../common/guards/rbac.guard';
import { logAuditEvent } from '../../common/middleware/audit';

const router = Router();

/**
 * GET /users/me
 */
router.get('/me', requireAuth, (req: AppRequest, res: Response) => {
  const user = db.getUserById(req.user!.id);
  const org = db.getUserOrg(req.user!.id);
  const role = db.getUserRole(req.user!.id);

  return res.status(200).json({
    data: {
      id: user?.id,
      email: user?.email,
      displayName: user?.display_name,
      status: user?.status,
      lastLoginAt: user?.last_login_at,
      organization: org ? { id: org.id, legalName: org.legal_name } : null,
      role: role ? { id: role.id, name: role.name } : null,
    },
    requestId: req.requestId,
  });
});

/**
 * PATCH /users/me
 */
router.patch('/me', requireAuth, (req: AppRequest, res: Response) => {
  const { displayName } = req.body;
  const user = db.getUserById(req.user!.id);

  if (user && displayName) {
    user.display_name = displayName;
    user.updated_at = new Date().toISOString();
  }

  return res.status(200).json({
    data: {
      id: user?.id,
      displayName: user?.display_name,
      email: user?.email,
    },
    requestId: req.requestId,
  });
});

/**
 * Admin: GET /admin/users
 */
router.get(
  '/',
  requireAuth,
  requireRoles(['platform_super_admin', 'operations_admin', 'security_compliance_admin']),
  (req: AppRequest, res: Response) => {
    const userList = db.users.map((u) => {
      const org = db.getUserOrg(u.id);
      const role = db.getUserRole(u.id);
      return {
        id: u.id,
        email: u.email,
        displayName: u.display_name,
        status: u.status,
        organizationName: org?.legal_name || 'Unassigned',
        roleName: role?.name || 'No Role',
        lastLoginAt: u.last_login_at,
        createdAt: u.created_at,
      };
    });

    return res.status(200).json({
      data: userList,
      requestId: req.requestId,
    });
  },
);

/**
 * Admin: POST /admin/users
 * Onboard new user / recovery officer / bank nodal officer
 */
router.post(
  '/',
  requireAuth,
  requireRoles(['platform_super_admin', 'operations_admin']),
  (req: AppRequest, res: Response, next) => {
    try {
      const { email, displayName, roleName, organizationId } = req.body;

      if (!email || !displayName) {
        return next(new AppError('Email and display name are required.', 'VALIDATION_ERROR', 400));
      }

      const existing = db.getUserByEmail(email);
      if (existing) {
        return next(new AppError('A user with this email address already exists.', 'CONFLICT', 409));
      }

      const org = organizationId ? db.getOrgById(organizationId) : db.organizations[0];
      const targetRole = roleName ? db.roles.find((r) => r.name === roleName) : db.roles.find((r) => r.name === 'panacea_legal_recovery_user');

      const newUser = {
        id: uuidv4(),
        email: email.toLowerCase().trim(),
        display_name: displayName.trim(),
        password_hash: null, // demo password PanaceaSecure2026!# will authenticate
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login_at: null,
      };

      db.users.push(newUser);

      if (org) {
        db.organizationMemberships.push({
          id: `mem-${newUser.id}`,
          organization_id: org.id,
          user_id: newUser.id,
          status: 'active',
          created_at: new Date().toISOString(),
          revoked_at: null,
        });
      }

      if (targetRole && org) {
        db.userRoles.push({
          id: `ur-${newUser.id}`,
          user_id: newUser.id,
          role_id: targetRole.id,
          organization_id: org.id,
          created_at: new Date().toISOString(),
        });
      }

      logAuditEvent({
        actorUserId: req.user!.id,
        eventType: 'USER_CREATED',
        action: 'CREATE',
        resourceType: 'USER',
        resourceId: newUser.id,
        result: 'success',
        requestId: req.requestId,
        metadata: { email: newUser.email, role: targetRole?.name, organization: org?.legal_name },
      });

      return res.status(201).json({
        data: {
          id: newUser.id,
          email: newUser.email,
          displayName: newUser.display_name,
          status: newUser.status,
          organizationName: org?.legal_name || 'Unassigned',
          roleName: targetRole?.name || 'No Role',
          createdAt: newUser.created_at,
        },
        requestId: req.requestId,
      });
    } catch (err) {
      return next(err);
    }
  },
);

/**
 * Admin: POST /admin/users/:id/disable
 */
router.post(
  '/:id/disable',
  requireAuth,
  requireRoles(['platform_super_admin']),
  (req: AppRequest, res: Response, next) => {
    const id = req.params.id as string;
    const user = db.getUserById(id);

    if (!user) {
      return next(new AppError('User not found.', 'NOT_FOUND', 404));
    }

    user.status = 'disabled';
    user.updated_at = new Date().toISOString();

    // Revoke all active sessions for this user
    db.sessions
      .filter((s) => s.user_id === id && !s.revoked_at)
      .forEach((s) => {
        s.revoked_at = new Date().toISOString();
      });

    logAuditEvent({
      actorUserId: req.user!.id,
      eventType: 'USER_DISABLED',
      action: 'DISABLE',
      resourceType: 'USER',
      resourceId: id,
      result: 'success',
      requestId: req.requestId,
    });

    return res.status(200).json({
      data: { message: `User account ${user.email} disabled and active sessions revoked.` },
      requestId: req.requestId,
    });
  },
);

/**
 * Admin: POST /admin/users/:id/enable
 */
router.post(
  '/:id/enable',
  requireAuth,
  requireRoles(['platform_super_admin']),
  (req: AppRequest, res: Response, next) => {
    const id = req.params.id as string;
    const user = db.getUserById(id);

    if (!user) {
      return next(new AppError('User not found.', 'NOT_FOUND', 404));
    }

    user.status = 'active';
    user.updated_at = new Date().toISOString();

    logAuditEvent({
      actorUserId: req.user!.id,
      eventType: 'USER_ENABLED',
      action: 'ENABLE',
      resourceType: 'USER',
      resourceId: id,
      result: 'success',
      requestId: req.requestId,
    });

    return res.status(200).json({
      data: { message: `User account ${user.email} re-enabled.` },
      requestId: req.requestId,
    });
  },
);

export default router;
