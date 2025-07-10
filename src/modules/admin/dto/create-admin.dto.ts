// src/modules/admin/dto/create-admin.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { AdminRole, ADMIN_ROLE_VALUES } from 'src/common/constants/admin-role';
import { PasswordValidator } from 'src/common/validators/password-validator';

export class CreateAdminDto extends PasswordValidator {
  @ApiProperty({ example: 'admin@example.com', description: '관리자 이메일' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'GENERAL_ADMIN', enum: ADMIN_ROLE_VALUES, description: '관리자 권한' })
  @IsEnum(ADMIN_ROLE_VALUES)
  role: AdminRole;
}
