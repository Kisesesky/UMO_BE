// src/common/exceptions/rental.exceptions.ts
import { HttpException, HttpStatus } from '@nestjs/common';
import { RentalMessages } from '../messages/rental-messages';

export class RentalNotFoundException extends HttpException {
  constructor() {
    super(RentalMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}

export class RentalStatusException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}