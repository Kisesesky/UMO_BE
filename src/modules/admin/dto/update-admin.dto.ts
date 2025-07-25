// src/modules/admin/dto/update-admin.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { PasswordValidator } from 'src/common/validators/password-validator';
import { AdminRole, ADMIN_ROLE_VALUES } from 'src/modules/admin/constants/admin-role';

export class UpdateAdminDto extends PasswordValidator {
  @ApiPropertyOptional({ example: 'admin@example.com', description: '관리자 이메일' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'GENERAL_ADMIN', enum: ADMIN_ROLE_VALUES, description: '관리자 권한' })
  @IsOptional()
  @IsEnum(ADMIN_ROLE_VALUES)
  role?: AdminRole;

  @ApiPropertyOptional({ example: true, description: '활성화 여부' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
