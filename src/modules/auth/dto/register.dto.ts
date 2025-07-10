// src/auth/dto/register.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: '김철수', description: '사용자 이름' })
  @IsNotEmpty()
  @MaxLength(8)
  @Matches(/^[가-힣a-zA-Z0-9]+$/)
  @IsString()
  name: string;

  @ApiProperty({ example: 'test@example.com', description: '사용자 이메일' })
  @IsNotEmpty()
  @IsEmail({}, { message: '유효한 이메일 형식이 아닙니다.' })
  email: string;

  @ApiProperty({ example: 'Password123!', description: '사용자 비밀번호' })
  @IsNotEmpty()
  @IsString()
  @MinLength(9, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  @MaxLength(20, { message: '비밀번호는 최대 30자 이하여야 합니다.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,20}$/, {
    message: '비밀번호는 영문 대소문자, 숫자, 특수문자(@$!%*?&)를 포함하여 9~20자여야 합니다.',
  })
  password: string;

  @ApiProperty({ example: true, description: '서비스 이용 약관 동의' })
  @IsBoolean()
  agreedTerms: boolean;

  @ApiProperty({ example: true, description: '개인정보 처리 방침 동의' })
  @IsBoolean()
  agreedPrivacy: boolean;
}
