// src/modules/products/types/currency-types.ts
export const CURRENCY_TYPE = {
  CHURU: 'CHURU', // 츄르로 결제
  CATNIP: 'CATNIP', // 캣닢으로 결제
  REAL_MONEY: 'REAL_MONEY', // 실제 돈으로 결제
} as const;
export type CurrencyType = typeof CURRENCY_TYPE[keyof typeof CURRENCY_TYPE];

export const CURRENCY_TYPE_VALUES = Object.values(CURRENCY_TYPE);
