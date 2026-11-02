import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { UserRole, AuthenticatedUser } from '@shopnix/types';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<{ user: AuthenticatedUser }>();

    if (!user || !user.role) {
      throw new ForbiddenException('Access denied: User role unverified');
    }

    // Role hierarchy: owner > admin > manager > staff
    const roleHierarchy: Record<UserRole, number> = {
      owner: 4,
      admin: 3,
      manager: 2,
      staff: 1,
    };

    const userLevel = roleHierarchy[user.role] ?? 0;
    const hasRole = requiredRoles.some((role) => userLevel >= (roleHierarchy[role] ?? 0));

    if (!hasRole) {
      throw new ForbiddenException(`Insufficient permissions. Required: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}
