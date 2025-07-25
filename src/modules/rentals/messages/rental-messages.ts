// src/modules/rentals/messages/rental-messages.ts
export const RentalMessages = {
  NOT_FOUND: '대여 정보를 찾을 수 없습니다',
  USER_NOT_FOUND: '사용자를 찾을 수 없습니다',
  UMBRELLA_NOT_FOUND: '우산을 찾을 수 없습니다',
  ALREADY_RENTED: '이미 대여 중인 우산입니다',
  INSUFFICIENT_BALANCE: '잔액이 부족합니다. 최소 10,000원이 필요합니다',
  INVALID_RENTAL_CONFIRM: '유효하지 않은 대여 요청입니다',
  ALREADY_RETURNED: '이미 반납된 우산입니다',
  LOST_CANNOT_RETURN: '분실 처리된 우산은 반납할 수 없습니다',
  CANCELED_CANNOT_RETURN: '취소된 대여는 반납할 수 없습니다',
  LOST_ONLY_WHEN_RENTED: '대여 중인 우산만 분실 처리할 수 있습니다',
  CANNOT_CANCEL: '대기 중인 대여만 취소할 수 있습니다',
  CONFIRM_ONLY_WHEN_PENDING: '대기 중인 대여만 확정할 수 있습니다',
  CANCEL_ONLY_WHEN_PENDING: '대기 중인 대여만 취소할 수 있습니다',
  RETURN_ONLY_WHEN_RENTED: '대여 중인 우산만 반납할 수 있습니다',
} as const;