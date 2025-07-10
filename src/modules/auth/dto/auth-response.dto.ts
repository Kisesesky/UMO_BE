// src/auth/dto/auth-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT 액세스 토큰' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT 리프레시 토큰', required: false })
  refreshToken?: string; // 리프레시 토큰은 쿠키로만 전송할 수도 있어서 optional로 설정

  @ApiProperty({ type: UserResponseDto, description: '사용자 정보' })
  user: UserResponseDto;
}
