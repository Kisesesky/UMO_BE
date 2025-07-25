// src/common/guards/roles.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/modules/users/constants/user-role';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true; // 역할이 지정되지 않은 경우 접근 허용
    }
    
    const { user } = context.switchToHttp().getRequest();
    
    // 사용자 정보가 없으면 접근 거부
    if (!user) {
      return false;
    }
    
    // 사용자의 역할이 필요한 역할 중 하나라도 포함되어 있으면 접근 허용
    return requiredRoles.some((role) => user.role === role);
  }
}