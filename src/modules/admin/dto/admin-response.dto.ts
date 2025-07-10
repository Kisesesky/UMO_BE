// src/modules/admin/dto/admin-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { AdminRole } from 'src/common/constants/admin-role';
import { Admin } from '../entities/admin.entity';

export class AdminResponseDto extends BaseResponseDto {
  @ApiProperty({ example: 'admin@company.com', description: '관리자 이메일' })
  email: string;

  @ApiProperty({ example: 'SUPER_ADMIN', description: '관리자 권한' })
  role: AdminRole;

  @ApiProperty({ example: true, description: '활성화 여부' })
  isActive: boolean;

  constructor(admin: Admin) {
    super(admin);
    this.email = admin.email;
    this.role = admin.role;
    this.isActive = admin.isActive;
  }
}
