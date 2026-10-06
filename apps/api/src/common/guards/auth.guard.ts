import { Response, NextFunction } from 'express';
import crypto from 'crypto';
import { AppRequest } from '../types';
import { AppError } from '../filters/error.filter';
import { db } from '../../database/db';

/**
 * PANACEA AUTHENTICATION GUARD
 *
 * Enforces session validity:
 * 1. Extracts session verifier from HttpOnly cookie (or Bearer for non-browser API clients)
 * 2. Computes SHA-256 verifier hash
 * 3. Compares against hashed verifiers stored in the database (never compares raw secrets)
 * 4. Checks session expiration, active revocation status, and user account status
 */
export const requireAuth = async (req: AppRequest, _res: Response, next: NextFunction) => {
  try {
    // Extract token from HttpOnly cookie or Authorization Bearer
    let token = req.cookies?.panacea_session;
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    if (!token) {
      return next(new AppError('Authentication required. No active session found.', 'UNAUTHORIZED', 401));
    }

    // Hash incoming token with SHA-256 to compare with session_hash stored in PostgreSQL (RAW VERIFIER NEVER STORED)
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Authoritative session lookup from PostgreSQL
    const session = await db.getSessionByVerifierHash(hashedToken);

    if (!session) {
      return next(new AppError('Session is invalid, revoked, or has expired.', 'UNAUTHORIZED', 401));
    }

    // Update last seen timestamp
    await db.touchSession(session.id);
    req.sessionId = session.id;

    // Lookup user from PostgreSQL
    const user = await db.getUserById(session.user_id);
    if (!user || user.status !== 'active') {
      return next(new AppError('User account is inactive or disabled.', 'FORBIDDEN', 403));
    }

    const org = await db.getUserOrg(user.id);
    const role = await db.getUserRole(user.id);

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
  } catch (err) {
    return next(err);
  }
};

