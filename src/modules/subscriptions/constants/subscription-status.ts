// src/modules/subscriptions/constants/subscription-status.ts
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  CANCELED: 'CANCELED',
  REFUNDED: 'REFUNDED',
} as const;
export type SubscriptionStatus = typeof SUBSCRIPTION_STATUS[keyof typeof SUBSCRIPTION_STATUS];

export const SUBSCRIPTION_STATUS_VALUES = Object.values(SUBSCRIPTION_STATUS);
