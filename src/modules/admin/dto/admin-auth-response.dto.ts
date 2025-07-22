// src/modules/admin/dto/admin-auth-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { AdminResponseDto } from './admin-response.dto';

export class AdminAuthResponseDto {
  @ApiProperty({ example: 'JWT_ACCESS_TOKEN', description: '어드민 JWT 액세스 토큰' })
  accessToken: string;

  @ApiProperty({ example: 'JWT_REFRESH_TOKEN', description: '어드민 JWT 리프레시 토큰', required: false })
  refreshToken?: string;

  @ApiProperty({ type: AdminResponseDto, description: '관리자 정보' })
  admin: AdminResponseDto;
}
