// src/modules/notification/constants/notification-status.ts
export const NOTIFICATION_STATUS = {
  WEATHER: 'WEATHER',
  SYSTEM: 'SYSTEM',
  PROMOTION: 'PROMOTION',
} as const;
export type NotificationStatus = typeof NOTIFICATION_STATUS[keyof typeof NOTIFICATION_STATUS];

export const NOTIFICATION_STATUS_VALUES = Object.values(NOTIFICATION_STATUS);
