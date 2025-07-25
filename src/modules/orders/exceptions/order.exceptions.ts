// src/modules/orders/exceptions/order.exceptions.ts
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ORDER_MESSAGE } from '../messages/order-message';

export class OrderNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(ORDER_MESSAGE.NOT_FOUND(id));
  }
}

export class OrderAlreadyProcessedException extends BadRequestException {
  constructor(status: string) {
    super(ORDER_MESSAGE.ALREADY_PROCESSED(status));
  }
}

export class OrderCannotCancelException extends BadRequestException {
  constructor(status: string) {
    super(ORDER_MESSAGE.CANNOT_CANCEL(status));
  }
}

export class UnsupportedCurrencyException extends BadRequestException {
  constructor(currency: string) {
    super(ORDER_MESSAGE.UNSUPPORTED_CURRENCY(currency));
  }
}

export class RealMoneyPaymentException extends BadRequestException {
  constructor() {
    super(ORDER_MESSAGE.REAL_MONEY_PAYMENT);
  }
}

export class RealMoneyRefundException extends BadRequestException {
  constructor() {
    super(ORDER_MESSAGE.REAL_MONEY_REFUND);
  }
}
