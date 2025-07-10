//src/common/constatns/rental-status.ts
export const RENTAL_STATUS = {
  PENDING: 'PENDING',
  RENTED: 'RENTED',
  RETURNED: 'RETURNED',
  CANCELED: 'CANCELED',
  LOST: 'LOST', 
} as const;

export type RentalStatus = typeof RENTAL_STATUS[keyof typeof RENTAL_STATUS];

export const RENTAL_STATUS_VALUES = Object.values(RENTAL_STATUS);