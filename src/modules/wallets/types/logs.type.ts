// src/modules/wallets/types/logs.type.ts
export const WALLET_LOG_TYPE = {
  CATNIP: 'CATNIP',
  CHURU: 'CHURU',
  COUPON: 'COUPON'
} as const

export type WalletLogType = typeof WALLET_LOG_TYPE[keyof typeof WALLET_LOG_TYPE];

export const WALLET_LOG_TYPE_VALUES = Object.values(WALLET_LOG_TYPE);
