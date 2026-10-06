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
router.get('/', requireAuth, (req: AppRequest, res: Response) => {
  const userNotifs = db.notifications
    .filter((n) => n.recipient_user_id === req.user!.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return res.status(200).json({
    data: userNotifs,
    requestId: req.requestId,
  });
});

/**
 * PATCH /notifications/:id/read
 */
router.patch('/:id/read', requireAuth, (req: AppRequest, res: Response, next) => {
  const { id } = req.params;
  const notif = db.notifications.find((n) => n.id === id && n.recipient_user_id === req.user!.id);

  if (!notif) {
    return next(new AppError('Notification not found.', 'NOT_FOUND', 404));
  }

  notif.read_at = new Date().toISOString();

  return res.status(200).json({
    data: notif,
    requestId: req.requestId,
  });
});

/**
 * Admin: POST /admin/notifications
 */
router.post(
  '/',
  requireAuth,
  requireRoles(['platform_super_admin', 'operations_admin']),
  (req: AppRequest, res: Response, next) => {
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
      read_at: null,
      created_at: new Date().toISOString(),
    };

    db.notifications.unshift(newNotif);

    return res.status(201).json({
      data: newNotif,
      requestId: req.requestId,
    });
  },
);

export default router;
