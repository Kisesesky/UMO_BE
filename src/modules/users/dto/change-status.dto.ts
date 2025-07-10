// src/users/dto/change-status.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { USER_STATUS_VALUES, UserStatus } from 'src/common/constants/user-status';

export class UserChangeStatusDto {
  @ApiProperty({ enum: USER_STATUS_VALUES, description: '변경할 사용자 상태' })
  @IsNotEmpty()
  @IsEnum(USER_STATUS_VALUES)
  status: UserStatus;
}
