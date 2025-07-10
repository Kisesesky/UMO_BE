// src/common/messages/user-messages.ts
export const UserMessages = {
  NOT_FOUND: '사용자를 찾을 수 없습니다',
  EMAIL_EXISTS: '이미 사용 중인 이메일입니다',
  INVALID_PASSWORD: '비밀번호가 일치하지 않습니다',
  INSUFFICIENT_BALANCE: '잔액이 부족합니다',
  INACTIVE_ACCOUNT: '비활성화된 계정입니다',
  SUSPENDED_ACCOUNT: '정지된 계정입니다',
  BANNED_ACCOUNT: '차단된 계정입니다',
  PENDING_VERIFICATION: '이메일 인증이 필요합니다',
  UNAUTHORIZED: '권한이 없습니다',
  // 필요한 메시지 추가
} as const;
