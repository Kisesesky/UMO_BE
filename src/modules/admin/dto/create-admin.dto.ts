// src/modules/admin/dto/create-admin.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum } from 'class-validator';
import { PasswordValidator } from 'src/common/validators/password-validator';
import { AdminRole, ADMIN_ROLE_VALUES } from 'src/modules/admin/constants/admin-role';

export class CreateAdminDto extends PasswordValidator {
  @ApiProperty({ example: 'admin@example.com', description: '관리자 이메일' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'GENERAL_ADMIN', enum: ADMIN_ROLE_VALUES, description: '관리자 권한' })
  @IsEnum(ADMIN_ROLE_VALUES)
  role: AdminRole;
}
