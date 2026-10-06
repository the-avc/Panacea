import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../database/db';
import { AppRequest } from '../../common/types';
import { AppError } from '../../common/filters/error.filter';
import { requireAuth } from '../../common/guards/auth.guard';
import { requireRoles } from '../../common/guards/rbac.guard';

const router = Router();

/**
 * GET /notifications
 * Gets notifications for currently logged in user
 */
router.get('/', requireAuth, async (req: AppRequest, res: Response, next) => {
  try {
    const userNotifs = await db.getNotificationsByUser(req.user!.id);

    return res.status(200).json({
      data: userNotifs,
      requestId: req.requestId,
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * PATCH /notifications/:id/read
 */
router.patch('/:id/read', requireAuth, async (req: AppRequest, res: Response, next) => {
  try {
    const id = req.params.id as string;
    const success = await db.markNotificationRead(id, req.user!.id);

    if (!success) {
      return next(new AppError('Notification not found.', 'NOT_FOUND', 404));
    }

    return res.status(200).json({
      data: { id, read_at: new Date().toISOString() },
      requestId: req.requestId,
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * Admin: POST /admin/notifications
 */
router.post(
  '/',
  requireAuth,
  requireRoles(['platform_super_admin', 'operations_admin']),
  async (req: AppRequest, res: Response, next) => {
    try {
      const { recipientUserId, type, title, body } = req.body;

      if (!recipientUserId || !title || !body) {
        return next(
          new AppError(
            'Missing required parameters: recipientUserId, title, body.',
            'VALIDATION_ERROR',
            400,
          ),
        );
      }

      const newNotif = {
        id: uuidv4(),
        recipient_user_id: recipientUserId,
        type: type || 'SYSTEM_ALERT',
        title,
        body,
        created_at: new Date().toISOString(),
      };

      const created = await db.createNotification(newNotif);

      return res.status(201).json({
        data: created,
        requestId: req.requestId,
      });
    } catch (err) {
      return next(err);
    }
  },
);

export default router;
