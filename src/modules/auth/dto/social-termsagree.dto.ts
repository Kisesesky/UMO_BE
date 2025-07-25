// src/modules/auth/dto/social-termsagree.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn, IsBoolean } from 'class-validator';
import { RegisterStatus, REGISTER_STATUS_VALUES } from "src/common/constants/register-status";

export class SocialTermsAgreeDto {
  @ApiProperty({
    example: '1234567890abcdef',
    description: '소셜 로그인으로 생성된 고유 식별자(socialId)',
  })
  @IsString()
  socialId: string;

  @ApiProperty({
    example: 'google',
    enum: REGISTER_STATUS_VALUES,
    description: '소셜 로그인 제공자 (google|kakao|naver)',
  })
  @IsIn(REGISTER_STATUS_VALUES)
  provider: RegisterStatus;

  @ApiProperty({
    example: true,
    description: '서비스 이용 약관 동의여부',
  })
  @IsBoolean()
  agreedTerms: boolean;

  @ApiProperty({
    example: true,
    description: '개인정보 처리 방침 동의여부',
  })
  @IsBoolean()
  agreedPrivacy: boolean;
}
