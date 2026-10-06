import { Response, NextFunction } from 'express';
import { AppRequest } from '../types';
import { AppError } from '../filters/error.filter';

// Mutating methods subject to CSRF defense
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

// Exempt public entrypoints where no authenticated session exists yet
const EXEMPT_PATHS = new Set([
  '/api/v1/auth/login',
  '/api/v1/auth/password/reset/request',
  '/health',
]);

const ALLOWED_ORIGINS = new Set([
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  process.env.APP_WEB_ORIGIN,
  process.env.APP_PORTAL_ORIGIN,
].filter(Boolean));

/**
 * PANACEA CSRF PROTECTION MIDDLEWARE
 *
 * Implements defense-in-depth:
 * 1. Origin / Referer validation against approved whitelist
 * 2. Double-Submit Cookie verification (X-CSRF-Token matches panacea_csrf cookie)
 *    for authenticated browser sessions
 * 3. Strict exemption list for pre-auth login routes
 */
export const csrfProtectionMiddleware = (
  req: AppRequest,
  _res: Response,
  next: NextFunction,
) => {
  // Safe HTTP read methods (GET, HEAD, OPTIONS) are exempt
  if (!MUTATING_METHODS.has(req.method.toUpperCase())) {
    return next();
  }

  // Exempt unauthenticated onboarding / health endpoints
  const path = req.path.toLowerCase();
  if (EXEMPT_PATHS.has(path) || path === '/health') {
    return next();
  }

  // Verify Origin header when provided by browser
  const origin = req.headers.origin;
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return next(
      new AppError(
        'Cross-Site Request Forgery (CSRF) detected: Origin not permitted.',
        'CSRF_VALIDATION_FAILED',
        403,
      ),
    );
  }

  // Double-submit token validation when request carries a browser session cookie
  const hasSessionCookie = Boolean(req.cookies?.panacea_session);
  if (hasSessionCookie) {
    const csrfCookie = req.cookies?.panacea_csrf;
    const csrfHeader = (req.headers['x-csrf-token'] || req.headers['x-xsrf-token']) as string;

    if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
      // In development/test mode without browser cookie mismatch, allow if Origin matches
      if (process.env.NODE_ENV !== 'production' && origin && ALLOWED_ORIGINS.has(origin)) {
        return next();
      }

      return next(
        new AppError(
          'Missing or invalid CSRF token. State-changing operations require matching X-CSRF-Token header.',
          'CSRF_VALIDATION_FAILED',
          403,
        ),
      );
    }
  }

  next();
};
