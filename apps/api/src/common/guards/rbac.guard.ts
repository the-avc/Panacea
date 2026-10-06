import { Response, NextFunction } from 'express';
import { AppRequest } from '../types';
import { AppError } from '../filters/error.filter';

export const requireRoles = (allowedRoles: string[]) => {
  return (req: AppRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 'UNAUTHORIZED', 401));
    }

    // Super admin always has access
    if (req.user.role === 'platform_super_admin') {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          'You do not possess the required security privileges for this operation.',
          'FORBIDDEN',
          403,
        ),
      );
    }

    next();
  };
};
