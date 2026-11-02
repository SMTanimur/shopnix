import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { FileLoggerService } from '../logger/file-logger.service';

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
    const userId = user?.id || user?._id || user?.sub;
    const organizationId = user?.organization_id;
    const ip = req.ip || req.socket.remoteAddress;

    return next.handle().pipe(
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
          const statusCode = err?.status || err?.statusCode || 500;

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
