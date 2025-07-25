// src/modules/admin/constants/admin-log-action-status.ts
export const ADMIN_LOG_ACTION = {
  CREATE: 'CREATE_ADMIN',
  UPDATE: 'UPDATE_ADMIN',
  REMOVE: 'REMOVE_ADMIN',
  LOGIN: 'LOGIN_ADMIN',
  LOGOUT: 'LOGOUT_ADMIN',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE_ADMIN',
} as const;

export type AdminLogAction = typeof ADMIN_LOG_ACTION[keyof typeof ADMIN_LOG_ACTION];

export const ADMIN_LOG_ACTION_VALUES = Object.values(ADMIN_LOG_ACTION);
