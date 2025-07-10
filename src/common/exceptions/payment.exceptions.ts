// src/common/exceptions/payment.exceptions.ts
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PAYMENT_MESSAGE } from '../messages/payment-message';

export class PortOneTokenFailException extends InternalServerErrorException {
  constructor(message: string) {
    super(PAYMENT_MESSAGE.TOKEN_FAIL(message));
  }
}

export class PortOneTokenErrorException extends InternalServerErrorException {
  constructor() {
    super(PAYMENT_MESSAGE.TOKEN_ERROR);
  }
}

export class PaymentLookupFailException extends BadRequestException {
  constructor(message: string) {
    super(PAYMENT_MESSAGE.PAYMENT_LOOKUP_FAIL(message));
  }
}

export class PaymentNotCompletedException extends BadRequestException {
  constructor() {
    super(PAYMENT_MESSAGE.PAYMENT_NOT_COMPLETED);
  }
}

export class MerchantUidMismatchException extends BadRequestException {
  constructor() {
    super(PAYMENT_MESSAGE.MERCHANT_UID_MISMATCH);
  }
}

export class AmountMismatchException extends BadRequestException {
  constructor() {
    super(PAYMENT_MESSAGE.AMOUNT_MISMATCH);
  }
}

export class UnknownPaymentException extends InternalServerErrorException {
  constructor() {
    super(PAYMENT_MESSAGE.UNKNOWN_ERROR);
  }
}
