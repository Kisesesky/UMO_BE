// src/modules/admin/dto/reset-password.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: '새 비밀번호' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message: '비밀번호는 영문 대소문자, 숫자, 특수문자를 포함해야 합니다.',
  })
  newPassword: string;

  @ApiProperty({ description: '새 비밀번호 확인' })
  @IsString()
  confirmNewPassword: string;
}
