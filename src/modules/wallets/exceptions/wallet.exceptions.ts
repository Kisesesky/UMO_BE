// src/modules/wallets/exceptions/wallet.exceptions.ts
import { HttpException, HttpStatus } from '@nestjs/common';
import { WalletMessages } from '../messages/wallet-messages';

export class WalletNotFoundException extends HttpException {
  constructor() {
    super(WalletMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}

export class InsufficientBalanceException extends HttpException {
  constructor(required: number, current: number) {
    super(`${WalletMessages.INSUFFICIENT_BALANCE} 필요: ${required}, 현재: ${current}`, HttpStatus.BAD_REQUEST);
  }
}

export class InvalidAmountException extends HttpException {
  constructor() {
    super(`${WalletMessages.INVALID_AMOUNT} 금액은 0보다 커야 합니다.`, HttpStatus.BAD_REQUEST);
  }
}
