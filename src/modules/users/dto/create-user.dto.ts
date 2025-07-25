// src/users/dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength, Min, MinLength } from 'class-validator';
import { UserRole, USER_ROLE_VALUES } from '../constants/user-role';
import { UserStatus, USER_STATUS_VALUES } from '../constants/user-status';
import { PasswordValidator } from 'src/common/validators/password-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'tester', description: '사용자 이름' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'test@test.com', description: '사용자 이메일' })
  @IsNotEmpty()
  @IsEmail({}, { message: '유효한 이메일 형식이 아닙니다.' })
  email: string;

  @ApiProperty({ type: PasswordValidator, description: '비밀번호' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  @MaxLength(30, { message: '비밀번호는 최대 30자 이하여야 합니다.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,20}$/, {
    message: '비밀번호는 영문 대소문자, 숫자, 특수문자(@$!%*?&)를 포함하여 9~20자여야 합니다.',
  })
  password: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  profileImage?: string;

  @ApiProperty({ example: 0, description: '초기 잔액', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  balance?: number;

  @ApiProperty({ example: 'USER', enum: USER_ROLE_VALUES, description: '사용자 역할', required: false })
  @IsOptional()
  @IsEnum(USER_ROLE_VALUES)
  role?: UserRole;

  @ApiProperty({ example: 'ACTIVE', enum: USER_STATUS_VALUES, description: '사용자 상태', required: false })
  @IsOptional()
  @IsEnum(USER_STATUS_VALUES)
  status?: UserStatus;

  @IsNotEmpty()
  @IsBoolean()
  agreedTerms: boolean;

  @IsNotEmpty()
  @IsBoolean()
  agreedPrivacy: boolean;
}
