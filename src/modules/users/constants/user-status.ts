// src/modules/users/constants/user-status.ts
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  BANNED: 'BANNED',
  PENDING_VERIFICATION: 'PENDING_VERIFICATION'
} as const;

//ACTIVE: 정상적으로 서비스를 이용 중인 사용자.
//INACTIVE: 계정은 존재하지만, 장기간 로그인하지 않거나 본인 인증이 필요한 사용자. (예: 6개월 이상 미접속 시 자동으로 INACTIVE로 전환)
//SUSPENDED: 일시적으로 서비스 이용이 정지된 사용자. (예: 요금 미납, 약관 위반)
//BANNED: 영구적으로 서비스 이용이 금지된 사용자. (예: 불법적인 활동)
//PENDING_VERIFICATION: 회원가입 후 이메일/휴대폰 인증을 기다리는 사용자.

export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];

export const USER_STATUS_VALUES = Object.values(USER_STATUS);
