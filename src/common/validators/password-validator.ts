// src/common/validators/password-validator.ts
import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordValidator {
  @ApiProperty({
    description: '비밀번호 (최소 8자, 영문/숫자/특수문자 포함)',
    example: 'Password123!',
    minLength: 9,
    maxLength: 20,
  })
  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @MinLength(9, { message: '비밀번호는 최소 9자 이상이어야 합니다.' })
  @MaxLength(20, { message: '비밀번호는 최대 20자 이하여야 합니다.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,20}$/, {
    message: '비밀번호는 영문 대소문자, 숫자, 특수문자(@$!%*?&)를 포함하여 9~20자여야 합니다.',
  })
  password: string;
}
