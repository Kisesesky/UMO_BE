// src/modules/wallets/types/ref.type.ts
export const WALLET_REF_TYPE = {
  REFERRAL: 'REFERRAL',
  CHALLENGE: 'CHALLENGE',
  ETC: 'ETC'
} as const

export type WalletRefType = typeof WALLET_REF_TYPE[keyof typeof WALLET_REF_TYPE];

export const WALLET_REF_TYPE_VALUES = Object.values(WALLET_REF_TYPE);
