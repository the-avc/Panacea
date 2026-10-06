import { Router, Response } from 'express';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../database/db';
import { AppRequest } from '../../common/types';
import { AppError } from '../../common/filters/error.filter';
import { requireAuth } from '../../common/guards/auth.guard';
import { requireRoles } from '../../common/guards/rbac.guard';
import { logAuditEvent, logSecurityEvent } from '../../common/middleware/audit';
import { validatePasswordStrength } from '@panacea/security';

const router = Router();

/**
 * GET /users/me
 */
router.get('/me', requireAuth, async (req: AppRequest, res: Response, next) => {
  try {
    const user = await db.getUserById(req.user!.id);
    const org = await db.getUserOrg(req.user!.id);
    const role = await db.getUserRole(req.user!.id);

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
  } catch (err) {
    return next(err);
  }
});

/**
 * PATCH /users/me
 */
router.patch('/me', requireAuth, async (req: AppRequest, res: Response, next) => {
  try {
    const { displayName } = req.body;
    let updatedUser = await db.getUserById(req.user!.id);

    if (updatedUser && displayName) {
      updatedUser = await db.updateUser(req.user!.id, { display_name: displayName });
    }

    return res.status(200).json({
      data: {
        id: updatedUser?.id,
        displayName: updatedUser?.display_name,
        email: updatedUser?.email,
      },
      requestId: req.requestId,
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * Admin: GET /admin/users
 */
router.get(
  '/',
  requireAuth,
  requireRoles(['platform_super_admin', 'operations_admin', 'security_compliance_admin']),
  async (req: AppRequest, res: Response, next) => {
    try {
      const userList = await db.getAllUsers();

      return res.status(200).json({
        data: userList,
        requestId: req.requestId,
      });
    } catch (err) {
      return next(err);
    }
  },
);

/**
 * Admin: POST /admin/users
 * Onboard new user / recovery officer / bank nodal officer
 * Enforces argon2id hashing of initial credentials (ZERO universal demo passwords)
 */
router.post(
  '/',
  requireAuth,
  requireRoles(['platform_super_admin', 'operations_admin']),
  async (req: AppRequest, res: Response, next) => {
    try {
      const { email, displayName, roleName, organizationId, initialPassword } = req.body;

      if (!email || !displayName) {
        return next(new AppError('Email and display name are required.', 'VALIDATION_ERROR', 400));
      }

      const existing = await db.getUserByEmail(email);
      if (existing) {
        return next(new AppError('A user with this email address already exists.', 'CONFLICT', 409));
      }

      // Generate or validate initial password
      let tempPassword = initialPassword;
      if (tempPassword) {
        const val = validatePasswordStrength(tempPassword);
        if (!val.valid) {
          return next(new AppError(val.errors.join(' '), 'VALIDATION_ERROR', 400));
        }
      } else {
        // High-entropy random temporary password: 16 alphanumeric + special
        tempPassword = `Pnc#${crypto.randomBytes(9).toString('base64').replace(/[^a-zA-Z0-9]/g, 'x')}!9`;
      }

      const argon2 = require('argon2');
      const passwordHash = await argon2.hash(tempPassword);

      const org = organizationId ? await db.getOrgById(organizationId) : (await db.getAllOrgs())[0];
      const targetRoleName = roleName || 'panacea_legal_recovery_user';
      const targetRole = db.roles.find((r) => r.name === targetRoleName);

      const newUser = {
        id: uuidv4(),
        email: email.toLowerCase().trim(),
        display_name: displayName.trim(),
        password_hash: passwordHash, // Cryptographically hashed with Argon2id
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login_at: null,
      };

      const membership = org
        ? {
            id: `mem-${newUser.id}`,
            organization_id: org.id,
            user_id: newUser.id,
          }
        : undefined;

      const userRole =
        targetRole && org
          ? {
              id: `ur-${newUser.id}`,
              user_id: newUser.id,
              role_id: targetRole.id,
              organization_id: org.id,
            }
          : undefined;

      await db.createUser(newUser, membership, userRole);

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
          temporaryPassword: tempPassword, // Provided one-time for secure distribution
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
 * Requires super-admin role, revokes sessions, logs security & audit events
 */
router.post(
  '/:id/disable',
  requireAuth,
  requireRoles(['platform_super_admin']),
  async (req: AppRequest, res: Response, next) => {
    try {
      const id = req.params.id as string;
      const user = await db.getUserById(id);

      if (!user) {
        return next(new AppError('User not found.', 'NOT_FOUND', 404));
      }

      const revokedCount = await db.disableUser(id);

      logSecurityEvent({
        userId: user.id,
        eventType: 'USER_ADMINISTRATIVELY_DISABLED',
        severity: 'medium',
        sourceIp: req.ip,
        requestId: req.requestId,
        details: { disabledUserId: id, revokedSessions: revokedCount },
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
        data: { message: `User account ${user.email} disabled and ${revokedCount} active session(s) revoked.` },
        requestId: req.requestId,
      });
    } catch (err) {
      return next(err);
    }
  },
);

/**
 * Admin: POST /admin/users/:id/enable
 */
router.post(
  '/:id/enable',
  requireAuth,
  requireRoles(['platform_super_admin']),
  async (req: AppRequest, res: Response, next) => {
    try {
      const id = req.params.id as string;
      const user = await db.getUserById(id);

      if (!user) {
        return next(new AppError('User not found.', 'NOT_FOUND', 404));
      }

      await db.enableUser(id);

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
    } catch (err) {
      return next(err);
    }
  },
);

export default router;
