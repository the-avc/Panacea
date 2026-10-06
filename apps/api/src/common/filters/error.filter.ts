import { Response, NextFunction } from 'express';
import { AppRequest } from '../types';

export class AppError extends Error {
  public code: string;
  public status: number;

  constructor(message: string, code: string = 'INTERNAL_ERROR', status: number = 500) {
    super(message);
    this.code = code;
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const errorHandlerMiddleware = (
  err: any,
  req: AppRequest,
  res: Response,
  _next: NextFunction,
) => {
  const requestId = req.requestId || 'unknown-request-id';
  const status = err.status || 500;
  const code = err.code || (status === 404 ? 'NOT_FOUND' : status === 401 ? 'UNAUTHORIZED' : status === 403 ? 'FORBIDDEN' : 'INTERNAL_SERVER_ERROR');

  // Log internal error safely on the server side
  console.error(`[ERROR] [${requestId}] ${err.name || 'Error'}: ${err.message}`);

  // Never leak internal stack traces or database errors to the client
  let clientMessage = err.message || 'An unexpected error occurred.';
  if (status >= 500) {
    clientMessage = 'An internal system error occurred. Please contact security administration.';
  }

  return res.status(status).json({
    error: {
      code,
      message: clientMessage,
      requestId,
    },
  });
};
