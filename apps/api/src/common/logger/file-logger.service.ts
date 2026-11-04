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

// ANSI Escape Codes for Pino-Pretty Style Colorized Console Output
const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  // Foreground colors
  fgBlack: '\x1b[30m',
  fgWhite: '\x1b[97m',
  fgGray: '\x1b[90m',
  fgEmerald: '\x1b[38;5;48m',
  fgGreen: '\x1b[32m',
  fgAmber: '\x1b[38;5;214m',
  fgYellow: '\x1b[33m',
  fgCrimson: '\x1b[38;5;197m',
  fgRed: '\x1b[31m',
  fgCyan: '\x1b[38;5;81m',
  fgBlue: '\x1b[38;5;75m',
  fgPurple: '\x1b[38;5;141m',
  fgRose: '\x1b[38;5;204m',
  // Background badges
  bgSuccess: '\x1b[48;5;35m\x1b[30m\x1b[1m',
  bgInfo: '\x1b[48;5;39m\x1b[30m\x1b[1m',
  bgWarn: '\x1b[48;5;214m\x1b[30m\x1b[1m',
  bgError: '\x1b[48;5;196m\x1b[97m\x1b[1m',
  bgDebug: '\x1b[48;5;141m\x1b[30m\x1b[1m',
};

@Injectable()
export class FileLoggerService implements NestLoggerService {
  private logDir: string;
  private controllersDir: string;
  private apiLogPath: string;
  private errorLogPath: string;
  private pinoJsonLogPath: string;
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
    this.pinoJsonLogPath = path.join(this.logDir, 'pino-telemetry.jsonl');

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
      if (
        this.SENSITIVE_KEYS.has(lower) ||
        lower.includes('secret') ||
        lower.includes('password') ||
        lower.includes('token')
      ) {
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

  private formatShortTime(): string {
    const now = new Date();
    return now.toISOString().replace('T', ' ').replace('Z', '');
  }

  public resolveControllerSlug(controllerName?: string): string {
    if (!controllerName) return 'general';
    return (
      controllerName
        .replace(/Controller$/i, '')
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .toLowerCase() || 'general'
    );
  }

  private formatMethodBadge(method = 'GET'): string {
    const m = method.toUpperCase();
    switch (m) {
      case 'GET':
        return `${ANSI.bold}${ANSI.fgCyan}GET   ${ANSI.reset}`;
      case 'POST':
        return `${ANSI.bold}${ANSI.fgEmerald}POST  ${ANSI.reset}`;
      case 'PATCH':
      case 'PUT':
        return `${ANSI.bold}${ANSI.fgAmber}${m.padEnd(6, ' ')}${ANSI.reset}`;
      case 'DELETE':
        return `${ANSI.bold}${ANSI.fgCrimson}DELETE${ANSI.reset}`;
      default:
        return `${ANSI.bold}${ANSI.fgPurple}${m.padEnd(6, ' ')}${ANSI.reset}`;
    }
  }

  private formatDurationBadge(ms = 0): string {
    if (ms < 80) {
      return `${ANSI.fgEmerald}+${ms}ms${ANSI.reset}`;
    }
    if (ms < 350) {
      return `${ANSI.fgAmber}+${ms}ms${ANSI.reset}`;
    }
    return `${ANSI.bold}${ANSI.fgCrimson}+${ms}ms${ANSI.reset}`;
  }

  private writeToFile(filePath: string, content: string): void {
    fs.appendFile(filePath, content + '\n', (err) => {
      if (err) {
        console.error(`[FileLoggerService] Error writing to ${filePath}:`, err.message);
      }
    });
  }

  /**
   * Log an incoming controller request & response completion with Pino-style colorized console telemetry
   */
  public logControllerAccess(ctx: LogContext): void {
    const timestamp = this.formatTimestamp();
    const shortTime = this.formatShortTime();
    const slug = this.resolveControllerSlug(ctx.controller);
    const controllerLogPath = path.join(this.controllersDir, `${slug}.log`);

    const statusTag = ctx.statusCode || 200;
    const isError = statusTag >= 400;
    const isServerError = statusTag >= 500;
    const level = isServerError ? 'ERROR' : isError ? 'WARN' : 'SUCCESS';

    // 1. Colorized Console Output (Pino-Pretty Style)
    const badge = isServerError
      ? `${ANSI.bgError} ERROR ${statusTag} ${ANSI.reset}`
      : isError
      ? `${ANSI.bgWarn} WARN ${statusTag} ${ANSI.reset}`
      : `${ANSI.bgSuccess} SUCCESS ${statusTag} ${ANSI.reset}`;

    const methodBadge = this.formatMethodBadge(ctx.method);
    const durationBadge = this.formatDurationBadge(ctx.durationMs ?? 0);
    const controllerTag = `${ANSI.fgPurple}[${ctx.controller || 'HTTP'}#${ctx.handler || 'handler'}]${ANSI.reset}`;
    const urlText = isError
      ? `${ANSI.bold}${ANSI.fgAmber}${ctx.url}${ANSI.reset}`
      : `${ANSI.fgWhite}${ctx.url}${ANSI.reset}`;

    const metaConsole: string[] = [];
    if (ctx.organizationId) metaConsole.push(`${ANSI.fgGray}org:${ctx.organizationId.slice(-6)}${ANSI.reset}`);
    if (ctx.userId) metaConsole.push(`${ANSI.fgGray}usr:${ctx.userId.slice(-6)}${ANSI.reset}`);

    const consoleLine = `${ANSI.fgGray}[${shortTime}]${ANSI.reset} ${badge} ${methodBadge} ${urlText} ${controllerTag} ${durationBadge}${
      metaConsole.length ? ' ' + metaConsole.join(' ') : ''
    }`;

    if (isServerError) {
      console.error(consoleLine);
      if (ctx.error) {
        console.error(`  ${ANSI.fgCrimson}↳ Error: ${typeof ctx.error === 'object' ? JSON.stringify(ctx.error) : ctx.error}${ANSI.reset}`);
      }
    } else if (isError) {
      console.warn(consoleLine);
      if (ctx.error) {
        console.warn(`  ${ANSI.fgAmber}↳ Reason: ${typeof ctx.error === 'object' ? JSON.stringify(ctx.error) : ctx.error}${ANSI.reset}`);
      }
    } else {
      console.log(consoleLine);
    }

    // 2. Plain-Text & JSONL Disk Logs
    const summary = `[${timestamp}] [${level}] [${ctx.controller || 'Controller'}#${ctx.handler || 'action'}] ${ctx.method} ${ctx.url} -> ${statusTag} (${ctx.durationMs ?? 0}ms)`;

    const metaParts = [];
    if (ctx.ip) metaParts.push(`IP: ${ctx.ip}`);
    if (ctx.userId) metaParts.push(`User: ${ctx.userId}`);
    if (ctx.organizationId) metaParts.push(`Org: ${ctx.organizationId}`);

    let logBlock = summary;
    if (metaParts.length > 0) {
      logBlock += ` | ${metaParts.join(' | ')}`;
    }

    const sanitizedReqBody =
      ctx.requestBody && Object.keys(ctx.requestBody).length > 0
        ? this.sanitize(ctx.requestBody)
        : undefined;

    if (sanitizedReqBody) {
      try {
        logBlock += `\n  Request Body: ${JSON.stringify(sanitizedReqBody)}`;
      } catch {
        // Ignore serialization issues
      }
    }

    if (isError && ctx.error) {
      const errMsg = typeof ctx.error === 'object' ? JSON.stringify(ctx.error) : String(ctx.error);
      logBlock += `\n  Error: ${errMsg}`;
      if (ctx.stack && isServerError) {
        logBlock += `\n  Stack: ${ctx.stack}`;
      }
    }

    // Write to dedicated controller log file & centralized API log
    this.writeToFile(controllerLogPath, logBlock);
    this.writeToFile(this.apiLogPath, logBlock);

    // Write structured Pino JSONL record
    const pinoRecord = JSON.stringify({
      time: timestamp,
      level: level.toLowerCase(),
      msg: `${ctx.method} ${ctx.url} ${statusTag}`,
      controller: ctx.controller,
      handler: ctx.handler,
      method: ctx.method,
      url: ctx.url,
      statusCode: statusTag,
      responseTimeMs: ctx.durationMs ?? 0,
      orgId: ctx.organizationId,
      userId: ctx.userId,
      ...(isError && ctx.error ? { err: String(ctx.error) } : {}),
    });
    this.writeToFile(this.pinoJsonLogPath, pinoRecord);

    if (isError) {
      this.writeToFile(this.errorLogPath, logBlock);
    }
  }

  // NestLoggerService interface implementations
  log(message: any, context?: string) {
    const timestamp = this.formatTimestamp();
    const shortTime = this.formatShortTime();
    const msgStr = typeof message === 'object' ? JSON.stringify(message) : String(message);
    const plainLine = `[${timestamp}] [INFO] [${context || 'App'}] ${msgStr}`;
    this.writeToFile(this.apiLogPath, plainLine);

    const isSuccessBootstrap =
      msgStr.includes('successfully started') ||
      msgStr.includes('Running on:') ||
      msgStr.includes('Swagger Docs:');

    const badge = isSuccessBootstrap
      ? `${ANSI.bgSuccess} READY   ${ANSI.reset}`
      : `${ANSI.bgInfo} INFO    ${ANSI.reset}`;

    const ctxColor = context === 'RouterExplorer' ? ANSI.fgGray : ANSI.fgCyan;
    const msgColor = isSuccessBootstrap ? `${ANSI.bold}${ANSI.fgEmerald}` : ANSI.fgWhite;

    console.log(
      `${ANSI.fgGray}[${shortTime}]${ANSI.reset} ${badge} ${ctxColor}[${context || 'App'}]${ANSI.reset} ${msgColor}${msgStr}${ANSI.reset}`
    );
  }

  error(message: any, trace?: string, context?: string) {
    const timestamp = this.formatTimestamp();
    const shortTime = this.formatShortTime();
    const msgStr = typeof message === 'object' ? JSON.stringify(message) : String(message);
    const plainLine = `[${timestamp}] [ERROR] [${context || 'App'}] ${msgStr}${trace ? '\n' + trace : ''}`;
    this.writeToFile(this.apiLogPath, plainLine);
    this.writeToFile(this.errorLogPath, plainLine);

    console.error(
      `${ANSI.fgGray}[${shortTime}]${ANSI.reset} ${ANSI.bgError} ERROR   ${ANSI.reset} ${ANSI.fgRose}[${context || 'App'}]${ANSI.reset} ${ANSI.bold}${ANSI.fgCrimson}${msgStr}${ANSI.reset}${
        trace ? `\n${ANSI.fgGray}${trace}${ANSI.reset}` : ''
      }`
    );
  }

  warn(message: any, context?: string) {
    const timestamp = this.formatTimestamp();
    const shortTime = this.formatShortTime();
    const msgStr = typeof message === 'object' ? JSON.stringify(message) : String(message);
    const plainLine = `[${timestamp}] [WARN] [${context || 'App'}] ${msgStr}`;
    this.writeToFile(this.apiLogPath, plainLine);

    console.warn(
      `${ANSI.fgGray}[${shortTime}]${ANSI.reset} ${ANSI.bgWarn} WARN    ${ANSI.reset} ${ANSI.fgAmber}[${context || 'App'}]${ANSI.reset} ${ANSI.fgYellow}${msgStr}${ANSI.reset}`
    );
  }

  debug?(message: any, context?: string) {
    const timestamp = this.formatTimestamp();
    const shortTime = this.formatShortTime();
    const msgStr = typeof message === 'object' ? JSON.stringify(message) : String(message);
    const plainLine = `[${timestamp}] [DEBUG] [${context || 'App'}] ${msgStr}`;
    this.writeToFile(this.apiLogPath, plainLine);

    console.debug(
      `${ANSI.fgGray}[${shortTime}]${ANSI.reset} ${ANSI.bgDebug} DEBUG   ${ANSI.reset} ${ANSI.fgPurple}[${context || 'App'}]${ANSI.reset} ${ANSI.fgGray}${msgStr}${ANSI.reset}`
    );
  }
}
