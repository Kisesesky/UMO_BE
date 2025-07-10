// src/users/dto/update-user.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength, MaxLength, Matches, IsNumber, Min, IsEnum } from 'class-validator';
import { USER_ROLE_VALUES, UserRole } from 'src/common/constants/user-role';
import { USER_STATUS_VALUES, UserStatus } from 'src/common/constants/user-status';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: '김철수', description: '사용자 이름', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'test@example.com', description: '사용자 이메일', required: false })
  @IsOptional()
  @IsEmail({}, { message: '유효한 이메일 형식이 아닙니다.' })
  email?: string;

  @ApiProperty({ description: '새 비밀번호 (변경 시)', required: false })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  @MaxLength(30, { message: '비밀번호는 최대 30자 이하여야 합니다.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/, {
    message: '비밀번호는 영문 대소문자, 숫자, 특수문자(@$!%*?&)를 포함하여 8~30자여야 합니다.',
  })
  password?: string;

  @ApiProperty({ example: 10000, description: '사용자 잔액', required: false })
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
}
