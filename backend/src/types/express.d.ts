import 'express';
import type { RequestContext } from '../middleware/requestContext';

declare module 'express-serve-static-core' {
  interface Locals {
    requestContext?: RequestContext;
  }
}

