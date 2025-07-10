// src/common/constants/umbrella-status.ts
export const UMBRELLA_STATUS = {
  AVAILABLE: 'AVAILABLE',   // 대여 가능
  RENTED: 'RENTED',         // 대여 중
  MAINTENANCE: 'MAINTENANCE', // 수리 중
  LOST: 'LOST',             // 분실됨
} as const;

export type UmbrellaStatus = typeof UMBRELLA_STATUS[keyof typeof UMBRELLA_STATUS];

export const UMBRELLA_STATUS_VALUES = Object.values(UMBRELLA_STATUS);
