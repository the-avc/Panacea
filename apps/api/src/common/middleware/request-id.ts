import { Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppRequest } from '../types';

export const requestIdMiddleware = (req: AppRequest, res: Response, next: NextFunction) => {
  const incomingId = req.headers['x-request-id'];
  const requestId = typeof incomingId === 'string' && incomingId.length > 0 ? incomingId : uuidv4();

  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
};
