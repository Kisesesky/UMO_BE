// src/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'test@test.com', description: '사용자 이메일' })
  @IsNotEmpty()
  @IsEmail({}, { message: '유효한 이메일 형식이 아닙니다.' })
  email: string;

  @ApiProperty({ example: 'Password123!', description: '사용자 비밀번호' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
