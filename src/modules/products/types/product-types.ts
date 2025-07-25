// src/modules/products/types/product-types.ts
export const PRODUCT_TYPE = {
  PASS: 'PASS', // 이용권
  CATNIP_ITEM: 'CATNIP_ITEM', // 캣닢 상품
  MD: 'MD', // MD 상품
} as const;
export type ProductType = typeof PRODUCT_TYPE[keyof typeof PRODUCT_TYPE];

export const PRODUCT_TYPE_VALUES = Object.values(PRODUCT_TYPE);
