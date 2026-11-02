import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface LogContext {
  controller?: string;
  handler?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  durationMs?: number;
  ip?: string;
  userId?: string;
  organizationId?: string;
  requestBody?: any;
  responseBody?: any;
  error?: any;
  stack?: string;
}

@Injectable()
export class FileLoggerService implements NestLoggerService {
  private logDir: string;
  private controllersDir: string;
  private apiLogPath: string;
  private errorLogPath: string;
  private readonly SENSITIVE_KEYS = new Set([
    'password',
    'confirm_password',
    'token',
    'refreshtoken',
    'access_token',
    'refresh_token',
    'apikey',
    'api_key',
    'clientsecret',
    'client_secret',
    'authorization',
    'secret',
    'credit_card',
    'card_number',
    'cvv',
  ]);

  constructor() {
    this.logDir = process.env.LOG_DIR || path.resolve(process.cwd(), 'logs');
    this.controllersDir = path.join(this.logDir, 'controllers');
    this.apiLogPath = path.join(this.logDir, 'api.log');
    this.errorLogPath = path.join(this.logDir, 'error.log');

    this.ensureDirectories();
  }

  private ensureDirectories(): void {
    try {
      if (!fs.existsSync(this.logDir)) {
        fs.mkdirSync(this.logDir, { recursive: true });
      }
      if (!fs.existsSync(this.controllersDir)) {
        fs.mkdirSync(this.controllersDir, { recursive: true });
      }
    } catch (err) {
      console.error('[FileLoggerService] Failed to create log directories:', err);
    }
  }

  public sanitize(obj: any): any {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitize(item));
    }

    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      const lower = key.toLowerCase();
      if (this.SENSITIVE_KEYS.has(lower) || lower.includes('secret') || lower.includes('password') || lower.includes('token')) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitize(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  public resolveControllerSlug(controllerName?: string): string {
    if (!controllerName) return 'general';
    return controllerName
      .replace(/Controller$/i, '')
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase() || 'general';
  }

  private writeToFile(filePath: string, content: string): void {
    fs.appendFile(filePath, content + '\n', (err) => {
      if (err) {
        // Fallback to console to avoid swallowing disk errors
        console.error(`[FileLoggerService] Error writing to ${filePath}:`, err.message);
      }
    });
  }

  /**
   * Log an incoming controller request & response completion
   */
  public logControllerAccess(ctx: LogContext): void {
    const timestamp = this.formatTimestamp();
    const slug = this.resolveControllerSlug(ctx.controller);
    const controllerLogPath = path.join(this.controllersDir, `${slug}.log`);

    const statusTag = ctx.statusCode || 200;
    const isError = statusTag >= 400;
    const level = isError ? (statusTag >= 500 ? 'ERROR' : 'WARN') : 'INFO';

    // Format single line summary
    const summary = `[${timestamp}] [${level}] [${ctx.controller || 'Controller'}#${ctx.handler || 'action'}] ${ctx.method} ${ctx.url} -> ${statusTag} (${ctx.durationMs ?? 0}ms)`;

    // Format metadata block
    const metaParts = [];
    if (ctx.ip) metaParts.push(`IP: ${ctx.ip}`);
    if (ctx.userId) metaParts.push(`User: ${ctx.userId}`);
    if (ctx.organizationId) metaParts.push(`Org: ${ctx.organizationId}`);

    let logBlock = summary;
    if (metaParts.length > 0) {
      logBlock += ` | ${metaParts.join(' | ')}`;
    }

    if (ctx.requestBody && Object.keys(ctx.requestBody).length > 0) {
      try {
        logBlock += `\n  Request Body: ${JSON.stringify(this.sanitize(ctx.requestBody))}`;
      } catch {
        // Ignore serialization issues
      }
    }

    if (isError && ctx.error) {
      const errMsg = typeof ctx.error === 'object' ? JSON.stringify(ctx.error) : String(ctx.error);
      logBlock += `\n  Error: ${errMsg}`;
      if (ctx.stack) {
        logBlock += `\n  Stack: ${ctx.stack}`;
      }
    }

    // Write to dedicated controller log file
    this.writeToFile(controllerLogPath, logBlock);

    // Also write to centralized API log
    this.writeToFile(this.apiLogPath, logBlock);

    // If an error, append to error.log
    if (isError) {
      this.writeToFile(this.errorLogPath, logBlock);
    }
  }

  // NestLoggerService interface implementations
  log(message: any, context?: string) {
    const timestamp = this.formatTimestamp();
    const line = `[${timestamp}] [INFO] [${context || 'App'}] ${typeof message === 'object' ? JSON.stringify(message) : message}`;
    this.writeToFile(this.apiLogPath, line);
    console.log(line);
  }

  error(message: any, trace?: string, context?: string) {
    const timestamp = this.formatTimestamp();
    const line = `[${timestamp}] [ERROR] [${context || 'App'}] ${typeof message === 'object' ? JSON.stringify(message) : message}${trace ? '\n' + trace : ''}`;
    this.writeToFile(this.apiLogPath, line);
    this.writeToFile(this.errorLogPath, line);
    console.error(line);
  }

  warn(message: any, context?: string) {
    const timestamp = this.formatTimestamp();
    const line = `[${timestamp}] [WARN] [${context || 'App'}] ${typeof message === 'object' ? JSON.stringify(message) : message}`;
    this.writeToFile(this.apiLogPath, line);
    console.warn(line);
  }

  debug?(message: any, context?: string) {
    const timestamp = this.formatTimestamp();
    const line = `[${timestamp}] [DEBUG] [${context || 'App'}] ${typeof message === 'object' ? JSON.stringify(message) : message}`;
    this.writeToFile(this.apiLogPath, line);
  }
}
