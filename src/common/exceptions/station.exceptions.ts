// src/common/exceptions/station.exceptions.ts
import { HttpException, HttpStatus } from '@nestjs/common';
import { StationMessages } from '../messages/station-messages';

export class StationNotFoundException extends HttpException {
  constructor() {
    super(StationMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}

export class StationAlreadyExistsException extends HttpException {
  constructor() {
    super(StationMessages.ALREADY_EXISTS, HttpStatus.CONFLICT);
  }
}

export class StationInactiveException extends HttpException {
  constructor() {
    super(StationMessages.INACTIVE, HttpStatus.BAD_REQUEST);
  }
}
