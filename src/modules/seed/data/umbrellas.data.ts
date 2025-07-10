// src/modules/seed/data/umbrellas.data.ts
// 우산 데이터는 stationId에 의존하므로, 서비스에서 동적으로 생성하는 것이 더 효율적일 수 있음.
// 여기서는 예시를 위해 간단히 정의.
export const UMBRELLAS_SEED_DATA = [
  { code: 'UM-GN-001', price: 15000, rentalFeePerHour: 1000 },
  { code: 'UM-GN-002', price: 15000, rentalFeePerHour: 1000 },
  { code: 'UM-HD-001', price: 15000, rentalFeePerHour: 1000 },
  { code: 'UM-HD-002', price: 15000, rentalFeePerHour: 1000 },
];