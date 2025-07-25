// src/modules/wallets/types/action.type.ts
export const WALLET_ACTION_TYPE = {
  WELCOME_REWARD: 'WELCOME_REWARD',
  REFERRAL_REWARD: 'REFERRAL_REWARD',
  PURCHASE: 'PURCHASE',
  EVENT: 'EVENT'
} as const

export type WalletActionType = typeof WALLET_ACTION_TYPE[keyof typeof WALLET_ACTION_TYPE];

export const WALLET_ACTION_TYPE_VALUES = Object.values(WALLET_ACTION_TYPE);
