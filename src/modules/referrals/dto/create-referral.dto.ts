// src/modules/referrals/dto/create-referral.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateReferralDto {
  @ApiProperty({ description: '초대 코드', example: 'aB12cdEf' })
  referralCode: string;

  @ApiProperty({ description: '추천된 유저(피추천인) id', example: 1234 })
  referredUserId: number;

  @ApiProperty()
  signUpIp: string;
}
