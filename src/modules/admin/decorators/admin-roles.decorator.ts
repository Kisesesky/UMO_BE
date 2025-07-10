// src/modules/admin/decorators/admin-roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { AdminRole } from './../../../common/constants/admin-role';

export const ADMIN_ROLES_KEY = 'adminRoles';
export const AdminRoles = (...roles: AdminRole[]) => SetMetadata(ADMIN_ROLES_KEY, roles);
