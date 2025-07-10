// src/common/messages/payment-message.ts
export const PAYMENT_MESSAGE = {
  TOKEN_FAIL: (msg: string) => `아임포트 토큰 발급 실패: ${msg}`,
  TOKEN_ERROR: '결제 시스템 연동 오류가 발생했습니다.',
  PAYMENT_LOOKUP_FAIL: (msg: string) => `아임포트 결제 정보 조회 실패: ${msg}`,
  PAYMENT_NOT_COMPLETED: '결제가 완료되지 않았습니다.',
  MERCHANT_UID_MISMATCH: '주문 번호가 일치하지 않습니다.',
  AMOUNT_MISMATCH: '결제 금액이 일치하지 않습니다.',
  UNKNOWN_ERROR: '결제 처리 중 알 수 없는 오류가 발생했습니다.',
  PAYMENT_SUCCESS: (userId: number, amount: number) =>
    `사용자 ${userId} 지갑에 ${amount}원 결제 후 츄르 지급 완료.`,
} as const;
