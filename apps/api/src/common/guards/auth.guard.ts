import { Response, NextFunction } from 'express';
import { AppRequest } from '../types';
import { AppError } from '../filters/error.filter';
import { db } from '../../database/db';

export const requireAuth = (req: AppRequest, _res: Response, next: NextFunction) => {
  // Extract token from HttpOnly cookie or Authorization Bearer
  let token = req.cookies?.panacea_session;
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  if (!token) {
    return next(new AppError('Authentication required. No active session token found.', 'UNAUTHORIZED', 401));
  }

  // Lookup session
  const session = db.sessions.find(
    (s) => s.session_hash === token && !s.revoked_at && new Date(s.expires_at) > new Date(),
  );

  if (!session) {
    return next(new AppError('Session is invalid, revoked, or has expired.', 'UNAUTHORIZED', 401));
  }

  // Update last seen
  session.last_seen_at = new Date().toISOString();
  req.sessionId = session.id;

  // Lookup user
  const user = db.getUserById(session.user_id);
  if (!user || user.status !== 'active') {
    return next(new AppError('User account is inactive or disabled.', 'FORBIDDEN', 403));
  }

  const org = db.getUserOrg(user.id);
  const role = db.getUserRole(user.id);

  req.user = {
    id: user.id,
    email: user.email,
    display_name: user.display_name,
    status: user.status,
    organization_id: org?.id || '',
    organization_name: org?.legal_name || '',
    role: role?.name || 'guest',
    permissions: [],
  };

  next();
};
