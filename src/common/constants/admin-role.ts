// src/common/constants/admin-role.ts
export const ADMIN_ROLE = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  GENERAL_ADMIN: 'GENERAL_ADMIN',
  SUPPORT_ADMIN: 'SUPPORT_ADMIN',
} as const;

export type AdminRole = typeof ADMIN_ROLE[keyof typeof ADMIN_ROLE];

export const ADMIN_ROLE_VALUES = Object.values(ADMIN_ROLE);
