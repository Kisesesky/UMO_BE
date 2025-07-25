import { ADMIN_ROLE } from 'src/modules/admin/constants/admin-role';

export const ADMINS_SEED_DATA = [
  {
    name: '슈퍼관리자',
    email: 'test@test.com',
    password: 'Test1234!',
    role: ADMIN_ROLE.SUPER_ADMIN,
    isActive: true,
  },
  {
    name: '일반 관리자',
    email: 'admin@admin.com',
    password: 'Admin1234!',
    role: ADMIN_ROLE.GENERAL_ADMIN,
    isActive: true,
  }
]
