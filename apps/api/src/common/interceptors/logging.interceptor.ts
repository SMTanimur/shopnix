import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { FileLoggerService } from '../logger/file-logger.service';

/**
 * Recursively normalizes Mongoose documents / plain objects so that any record with `_id`
 * always exposes a string `id` property for frontend safety.
 */
function normalizeDocumentIds(input: any, depth = 0): any {
  if (!input || typeof input !== 'object' || depth > 8) {
    return input;
  }

  if (input instanceof Date) {
    return input;
  }

  // If it's a Mongoose Document with .toJSON(), convert it first
  if (typeof input.toJSON === 'function') {
    try {
      input = input.toJSON();
    } catch {
      // fallback
    }
  }

  if (Array.isArray(input)) {
    return input.map((item) => normalizeDocumentIds(item, depth + 1));
  }

  // Handle BSON ObjectId directly
  if (input._bsontype === 'ObjectId' || input._bsontype === 'ObjectID') {
    return input.toString();
  }

  const out: Record<string, any> = {};
  for (const [key, val] of Object.entries(input)) {
    if (key === '_id' && val) {
      const idStr = typeof val === 'object' && val.toString ? val.toString() : String(val);
      out._id = idStr;
      if (!input.id) {
        out.id = idStr;
      }
    } else if (val && typeof val === 'object' && (val as any)._bsontype === 'ObjectId') {
      out[key] = val.toString();
    } else {
      out[key] = normalizeDocumentIds(val, depth + 1);
    }
  }

  return out;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly fileLogger: FileLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpCtx = context.switchToHttp();
    const req = httpCtx.getRequest<Request>();
    const res = httpCtx.getResponse<Response>();

    const startTime = Date.now();
    const controllerName = context.getClass().name;
    const handlerName = context.getHandler().name;

    const user = (req as any).user;
    const userId = user?.userId || user?.id || user?._id || user?.sub;
    const organizationId = user?.organizationId || user?.organization_id;
    const ip = req.ip || req.socket.remoteAddress;

    return next.handle().pipe(
      map((data) => normalizeDocumentIds(data)),
      tap({
        next: (data) => {
          const durationMs = Date.now() - startTime;
          const statusCode = res.statusCode || 200;

          this.fileLogger.logControllerAccess({
            controller: controllerName,
            handler: handlerName,
            method: req.method,
            url: req.originalUrl || req.url,
            statusCode,
            durationMs,
            ip,
            userId: userId ? String(userId) : undefined,
            organizationId: organizationId ? String(organizationId) : undefined,
            requestBody: req.body,
            responseBody: typeof data === 'object' ? '{...}' : data,
          });
        },
        error: (err) => {
          const durationMs = Date.now() - startTime;
          const isBsonCastError =
            err?.name === 'BSONError' ||
            err?.name === 'CastError' ||
            err?.message?.includes?.('24 character hex string');
          const statusCode = isBsonCastError ? 400 : err?.status || err?.statusCode || 500;

          this.fileLogger.logControllerAccess({
            controller: controllerName,
            handler: handlerName,
            method: req.method,
            url: req.originalUrl || req.url,
            statusCode,
            durationMs,
            ip,
            userId: userId ? String(userId) : undefined,
            organizationId: organizationId ? String(organizationId) : undefined,
            requestBody: req.body,
            error: err?.message || err,
            stack: err?.stack,
          });
        },
      }),
    );
  }
}
