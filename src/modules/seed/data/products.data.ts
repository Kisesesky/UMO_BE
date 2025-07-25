// src/modules/seed/data/products.data.ts
import { PRODUCT_TYPE } from '../../products/types/product-types';
import { CURRENCY_TYPE } from '../../products/types/currency-types';

export const PRODUCTS_SEED_DATA = [
  // --- 이용권 (PASS) (츄르결제) ---
  {
    name: '1일 이용권',
    description: '구매일 자정까지 무제한 우산 대여',
    price: 150, // 150 츄르
    productType: PRODUCT_TYPE.PASS,
    currencyType: CURRENCY_TYPE.CHURU,
    durationDays: 1,
    imageUrl: 'https://example.com/pass_1day.png',
    isActive: true,
  },
  {
    name: '7일 이용권',
    description: '7일간 무제한 우산 대여',
    price: 500, // 500 츄르
    productType: PRODUCT_TYPE.PASS,
    currencyType: CURRENCY_TYPE.CHURU,
    durationDays: 7,
    imageUrl: 'https://example.com/pass_7day.png',
    isActive: true,
  },
  {
    name: '30일 이용권',
    description: '30일간 무제한 우산 대여',
    price: 990, // 990 츄르
    productType: PRODUCT_TYPE.PASS,
    currencyType: CURRENCY_TYPE.CHURU,
    durationDays: 30,
    imageUrl: 'https://example.com/pass_30day.png',
    isActive: true,
  },
  {
    name: '연간 이용권',
    description: '365일 무제한 우산 대여',
    price: 4900, // 4900 츄르
    productType: PRODUCT_TYPE.PASS,
    currencyType: CURRENCY_TYPE.CHURU,
    durationDays: 365,
    imageUrl: 'https://example.com/pass_year.png',
    isActive: true,
  },
  // --- 이용권 (PASS) (현금결제) ---
  {
    name: '1일 이용권',
    description: '구매일 자정까지 무제한 우산 대여',
    price: 150, // 150 츄르
    productType: PRODUCT_TYPE.PASS,
    currencyType: CURRENCY_TYPE.REAL_MONEY,
    durationDays: 1,
    imageUrl: 'https://example.com/pass_1day.png',
    isActive: true,
  },
  {
    name: '7일 이용권',
    description: '7일간 무제한 우산 대여',
    price: 500, // 500 츄르
    productType: PRODUCT_TYPE.PASS,
    currencyType: CURRENCY_TYPE.REAL_MONEY,
    durationDays: 7,
    imageUrl: 'https://example.com/pass_7day.png',
    isActive: true,
  },
  {
    name: '30일 이용권',
    description: '30일간 무제한 우산 대여',
    price: 990, // 990 츄르
    productType: PRODUCT_TYPE.PASS,
    currencyType: CURRENCY_TYPE.REAL_MONEY,
    durationDays: 30,
    imageUrl: 'https://example.com/pass_30day.png',
    isActive: true,
  },
  {
    name: '연간 이용권',
    description: '365일 무제한 우산 대여',
    price: 4900, // 4900 츄르
    productType: PRODUCT_TYPE.PASS,
    currencyType: CURRENCY_TYPE.REAL_MONEY,
    durationDays: 365,
    imageUrl: 'https://example.com/pass_year.png',
    isActive: true,
  },
  // --- 캣닢 상품 (CATNIP_ITEM) ---
  {
    name: '특별 츄르 팩 (50츄르)',
    description: '캣닢으로 교환하는 츄르 팩',
    price: 100, // 100 캣닢
    productType: PRODUCT_TYPE.CATNIP_ITEM,
    currencyType: CURRENCY_TYPE.CATNIP,
    imageUrl: 'https://example.com/catnip_churu_pack.png',
    isActive: true,
  },
  {
    name: '프리미엄 캣닢 간식',
    description: '캣닢으로 구매하는 특별 간식',
    price: 50, // 50 캣닢
    productType: PRODUCT_TYPE.CATNIP_ITEM,
    currencyType: CURRENCY_TYPE.CATNIP,
    imageUrl: 'https://example.com/catnip_snack.png',
    isActive: true,
  },
  // --- MD 상품 (REAL_MONEY 결제) ---
  {
    name: '우모 캐릭터 우산',
    description: '우모 캐릭터가 그려진 고급 우산',
    price: 15000, // 15000원 (실제 돈)
    productType: PRODUCT_TYPE.MD,
    currencyType: CURRENCY_TYPE.REAL_MONEY,
    imageUrl: 'https://example.com/umo_umbrella.png',
    isActive: true,
  },
  {
    name: '우모 굿즈 세트',
    description: '우모 스티커, 키링, 뱃지 세트',
    price: 5000, // 5000원 (실제 돈)
    productType: PRODUCT_TYPE.MD,
    currencyType: CURRENCY_TYPE.REAL_MONEY,
    imageUrl: 'https://example.com/umo_goods.png',
    isActive: true,
  },
];