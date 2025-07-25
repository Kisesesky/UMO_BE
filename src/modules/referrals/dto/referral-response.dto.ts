// src/modules/referrals/dto/referral-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { Referral } from '../entities/referral.entity';

export class ReferralResponseDto extends BaseResponseDto {
  @ApiProperty() 
  referrerId: number;

  @ApiProperty() 
  referredId: number;

  @ApiProperty() 
  inviteCode: string;

  @ApiProperty() 
  rewardGiven: boolean;

  constructor(ref: Referral) {
    super(ref);
    this.referrerId = ref.referrer.id;
    this.referredId = ref.referred.id;
    this.inviteCode = ref.inviteCode.code;
    this.rewardGiven = ref.rewardGiven;
  }
}
