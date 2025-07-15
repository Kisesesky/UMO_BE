// src/modules/seed/data/users.data.ts
import { USER_ROLE } from 'src/common/constants/user-role';
import { USER_STATUS } from 'src/common/constants/user-status';

export const USERS_SEED_DATA = [
  {
    name: '관리자',
    email: 'admin@example.com',
    password: 'AdminPassword1!', // UserSubscriber가 해싱 처리
    role: USER_ROLE.ADMIN,
    status: USER_STATUS.ACTIVE,
    agreedTerms: true,
    agreedPrivacy: true,
  },
  {
    name: '테스트 사용자 1',
    email: 'user1@example.com',
    password: 'UserPassword1!',
    role: USER_ROLE.USER,
    status: USER_STATUS.ACTIVE,
    agreedTerms: true,
    agreedPrivacy: true,
  },
  {
    name: '비활성 사용자',
    email: 'inactive@example.com',
    password: 'UserPassword1!',
    role: USER_ROLE.USER,
    status: USER_STATUS.INACTIVE,
    agreedTerms: true,
    agreedPrivacy: true,
  },
];