import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminJwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Admin authorization token required');
    }

    const token = authHeader.split(' ')[1];
    try {
      const secret =
        this.configService.get<string>('ADMIN_JWT_SECRET') ||
        'super-secret-admin-jwt-token-key-change-in-production-min-32';

      const payload = await this.jwtService.verifyAsync(token, { secret });

      if (!payload.adminId || !payload.isAdmin) {
        throw new UnauthorizedException('Invalid admin credentials');
      }

      request.admin = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired admin session');
    }
  }
}
