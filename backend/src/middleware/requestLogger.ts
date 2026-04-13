import type { NextFunction, Request, Response } from 'express';
import { logger } from '../infrastructure/logger';

export function requestLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  res.on('finish', () => {
    const ctx = res.locals.requestContext;
    const durationMs = ctx ? Date.now() - ctx.startTimeMs : undefined;

    logger.info(
      {
        requestId: ctx?.requestId,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs,
      },
      'http_request',
    );
  });

  next();
}

