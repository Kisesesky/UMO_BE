import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString } from "class-validator";
import { RegisterStatus, REGISTER_STATUS, REGISTER_STATUS_VALUES } from "src/common/constants/register-status";

//src/modules/auth/dto/social-profile.dto.ts
export class SocialProfileDto {
  @ApiProperty({ example: 'test@test.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'tester' })
  @IsString()
  name: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  socialId: string;

  @ApiPropertyOptional({ example: 'https://...' })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiProperty({ example: REGISTER_STATUS.GOOGLE, enum: REGISTER_STATUS_VALUES })
  @IsString()
  @IsIn(REGISTER_STATUS_VALUES)
  registerType: RegisterStatus;
}