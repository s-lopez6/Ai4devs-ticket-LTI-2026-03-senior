import type { Request, Response, NextFunction } from 'express';
import { ConflictError, ValidationError } from '../application/errors';
import { logger } from '../infrastructure/logger';

type ErrorResponse = {
  success: false;
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
};

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction,
): void {
  const requestId = res.locals.requestContext?.requestId;

  if (err instanceof ValidationError) {
    logger.warn(
      {
        requestId,
        method: req.method,
        path: req.originalUrl,
        errorCode: err.code,
        details: err.details,
      },
      err.message,
    );
    res.status(400).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
        details: err.details,
      },
    });
    return;
  }

  if (err instanceof ConflictError) {
    logger.warn(
      {
        requestId,
        method: req.method,
        path: req.originalUrl,
        errorCode: err.code,
      },
      err.message,
    );
    res.status(409).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
      },
    });
    return;
  }

  logger.error(
    {
      requestId,
      method: req.method,
      path: req.originalUrl,
      err,
    },
    'Unhandled error',
  );

  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
    },
  });
}
