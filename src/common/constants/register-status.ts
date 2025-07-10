//src/common/constatns/register-status.ts
export const REGISTER_STATUS = {
  EMAIL: 'EMAIL',
  GOOGLE: 'GOOGLE',
  KAKAO: 'KAKAO',
  NAVER: 'NAVER', 
} as const;

export type RegisterStatus = typeof REGISTER_STATUS[keyof typeof REGISTER_STATUS];

export const REGISTER_STATUS_VALUES = Object.values(REGISTER_STATUS);