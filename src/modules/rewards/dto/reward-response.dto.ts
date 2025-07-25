// src/modules/rewards/dto/reward-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { RewardEntity } from '../entities/reward.entity';

export class RewardResponseDto {
  @ApiProperty() 
  userId: number;

  @ApiProperty() 
  rewardType: string;

  @ApiProperty() 
  amount: number;

  @ApiProperty() 
  reason: string;
  
  @ApiProperty() 
  createdAt: Date;

  constructor(reward: RewardEntity) {
    this.userId = reward.userId;
    this.rewardType = reward.rewardType;
    this.amount = reward.amount;
    this.reason = reward.reason;
    this.createdAt = reward.createdAt;
  }
}
