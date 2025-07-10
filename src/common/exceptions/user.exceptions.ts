// src/common/exceptions/user.exceptions.ts
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserMessages } from '../messages/user-messages';

// 기본 사용자 예외 클래스 (공통 로직 통일)
class UserExceptionBase extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super({ message, statusCode: status }, status);
  }
}

export class UserNotFoundException extends HttpException {
  constructor() {
    super(UserMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}

export class UserEmailExistsException extends HttpException {
  constructor() {
    super(UserMessages.EMAIL_EXISTS, HttpStatus.CONFLICT);
  }
}

export class UserInvalidPasswordException extends HttpException {
  constructor() {
    super(UserMessages.INVALID_PASSWORD, HttpStatus.UNAUTHORIZED);
  }
}

export class UserInsufficientBalanceException extends UserExceptionBase {
  constructor(required: number, current: number) {
    const message = `${UserMessages.INSUFFICIENT_BALANCE} 필요: ${required}원, 현재: ${current}원`;
    super(message, HttpStatus.BAD_REQUEST);
  }
}

// 사용자의 상태가 접근을 제한하는 경우 (ex. 비활성, 정지, 차단 등)
export class UserAccountStatusException extends UserExceptionBase {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN);
  }
}

// 상태별 예외 클래스들
export class UserInactiveException extends UserAccountStatusException {
  constructor() {
    super(UserMessages.INACTIVE_ACCOUNT);
  }
}

export class UserSuspendedException extends UserAccountStatusException {
  constructor() {
    super(UserMessages.SUSPENDED_ACCOUNT);
  }
}

export class UserBannedException extends UserAccountStatusException {
  constructor() {
    super(UserMessages.BANNED_ACCOUNT);
  }
}

export class UserPendingVerificationException extends UserAccountStatusException {
  constructor() {
    super(UserMessages.PENDING_VERIFICATION);
  }
}

export class UserUnauthorizedException extends UserExceptionBase {
  constructor() {
    super(UserMessages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
  }
}
