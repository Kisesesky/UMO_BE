// src/modules/admin/guards/admin-roles.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ADMIN_ROLES_KEY } from '../decorators/admin-roles.decorator';

@Injectable()
export class AdminRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Public Route exception
    if (this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(), context.getClass(),
    ])) {
      return true;
    }
    // requireRoles Check
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ADMIN_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // 역할 미지정 시 접근 허용하지 않음
    if (!requiredRoles) return false;
    const { user } = context.switchToHttp().getRequest();
    return !!user?.role && requiredRoles.includes(user.role);
  }
}