// src/common/messages/admin-messages.ts
export const AdminMessages = {
  NOT_FOUND: '관리자를 찾을 수 없습니다',
  EMAIL_EXISTS: '이미 사용 중인 이메일입니다',
  INVALID_PASSWORD: '비밀번호가 일치하지 않습니다',
  UNAUTHORIZED: '관리자 권한이 없습니다',
  LOGIN_FAILED: '이메일 또는 비밀번호가 일치하지 않습니다',
  ROLE_CHANGE_DENIED: 'SUPER_ADMIN만 권한을 변경할 수 있습니다',
  ACTION_LOGGED: '관리자 액션이 기록되었습니다',
} as const;
