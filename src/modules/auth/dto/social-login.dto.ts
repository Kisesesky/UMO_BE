// src/modules/auth/dto/social-login.dto.ts
import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RegisterStatus, REGISTER_STATUS, REGISTER_STATUS_VALUES } from 'src/common/constants/register-status';

export class SocialLoginDto {
  @ApiProperty({ example: REGISTER_STATUS.GOOGLE, enum: REGISTER_STATUS_VALUES })
  @IsString()
  @IsIn(REGISTER_STATUS_VALUES)
  provider: RegisterStatus;

  @ApiProperty({ example: 'ya29.a0ARrdaM...' })
  @IsString()
  accessToken: string;
}
