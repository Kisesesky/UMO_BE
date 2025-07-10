// src/common/exceptions/umbrella.exceptions.ts
import { HttpException, HttpStatus } from '@nestjs/common';
import { UmbrellaMessages } from '../messages/umbrella-messages';

export class UmbrellaNotFoundException extends HttpException {
  constructor() {
    super(UmbrellaMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}

export class UmbrellaStatusException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
