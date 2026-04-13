import type { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';

export type RequestContext = {
  requestId: string;
  startTimeMs: number;
};

const REQUEST_ID_HEADER = 'x-request-id';

function getHeaderValue(req: Request, headerName: string): string | undefined {
  const value = req.header(headerName);
  return value?.trim() ? value.trim() : undefined;
}

export function requestContextMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const incomingRequestId = getHeaderValue(req, REQUEST_ID_HEADER);
  const requestId = incomingRequestId ?? crypto.randomUUID();

  const ctx: RequestContext = { requestId, startTimeMs: Date.now() };
  res.locals.requestContext = ctx;
  res.setHeader(REQUEST_ID_HEADER, requestId);

  next();
}

