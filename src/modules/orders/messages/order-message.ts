// src/modules/orders/messages/order-message.ts
export const ORDER_MESSAGE = {
  NOT_FOUND: (id: number) => `주문 ID ${id}를 찾을 수 없습니다.`,
  ALREADY_PROCESSED: (status: string) => `이미 처리된 주문입니다. 현재 상태: ${status}`,
  CANNOT_CANCEL: (status: string) => `취소할 수 없는 주문 상태입니다. 현재 상태: ${status}`,
  UNSUPPORTED_CURRENCY: (currency: string) => `지원하지 않는 결제 화폐 유형입니다: ${currency}`,
  REAL_MONEY_PAYMENT: '실제 결제는 별도의 결제 프로세스를 통해 처리해야 합니다.',
  REAL_MONEY_REFUND: '실제 결제 환불은 별도의 환불 프로세스를 통해 처리해야 합니다.',
} as const;
