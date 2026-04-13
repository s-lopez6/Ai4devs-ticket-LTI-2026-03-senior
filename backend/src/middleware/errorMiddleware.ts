import type { Request, Response, NextFunction } from 'express';
import { ConflictError, ValidationError } from '../application/errors';

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
  _req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction,
): void {
  if (err instanceof ValidationError) {
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
    res.status(409).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
      },
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
    },
  });
}
