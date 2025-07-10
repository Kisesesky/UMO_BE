// src/common/exceptions/admin.exceptions.ts
import { HttpException, HttpStatus } from '@nestjs/common';
import { AdminMessages } from '../messages/admin-message';

// 공통 베이스 예외 클래스
class AdminExceptionBase extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super({ message, statusCode: status }, status);
  }
}

// 개별 예외들
export class AdminNotFoundException extends AdminExceptionBase {
  constructor() {
    super(AdminMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}

export class AdminEmailExistsException extends AdminExceptionBase {
  constructor() {
    super(AdminMessages.EMAIL_EXISTS, HttpStatus.CONFLICT);
  }
}

export class AdminInvalidPasswordException extends AdminExceptionBase {
  constructor() {
    super(AdminMessages.INVALID_PASSWORD, HttpStatus.UNAUTHORIZED);
  }
}

export class AdminUnauthorizedException extends AdminExceptionBase {
  constructor() {
    super(AdminMessages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
  }
}

export class AdminLoginFailedException extends AdminExceptionBase {
  constructor() {
    super(AdminMessages.LOGIN_FAILED, HttpStatus.UNAUTHORIZED);
  }
}

export class AdminRoleChangeDeniedException extends AdminExceptionBase {
  constructor() {
    super(AdminMessages.ROLE_CHANGE_DENIED, HttpStatus.FORBIDDEN);
  }
}
