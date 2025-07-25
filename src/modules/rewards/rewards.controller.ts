// src/modules/rewards/rewards.controller.ts
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RewardService } from './rewards.service';
import { RewardResponseDto } from './dto/reward-response.dto';

@ApiTags('Rewards')
@ApiBearerAuth()
@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardService: RewardService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '내 보상 내역 조회' })
  async myRewards(@Req() req): Promise<RewardResponseDto[]> {
    const userId = req.user.id;
    const rewards = await this.rewardService.getRewardsByUser(userId);
    return rewards.map((r) => new RewardResponseDto(r));
  }
}
