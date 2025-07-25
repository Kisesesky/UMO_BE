import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Reward } from './entities/reward.entity';
import { REWARD_TYPE } from "./constants/reward-types";
import { WalletsService } from '../wallets/wallets.service';
import { WALLET_ACTION_TYPE } from '../wallets/types/action.type';
import { WALLET_REF_TYPE } from '../wallets/types/ref.type';

@Injectable()
export class RewardsService {
  private readonly logger = new Logger(RewardsService.name);
  
  constructor(
    @InjectRepository(Reward)
    private readonly rewardRepository: Repository<Reward>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly walletsService: WalletsService,
  ) {}

  private readonly INVITER_REWARD_AMOUNT = 1000;
  private readonly INVITEE_REWARD_AMOUNT = 500;

  async giveInviteReward(inviterId: number, inviteeId: number): Promise<void> {
    if (inviterId === inviteeId) {
      throw new BadRequestException('자기 자신을 초대할 수 없습니다.');
    }
  
    const [inviter, invitee] = await Promise.all([
      this.userRepository.findOne({ where: { id: inviterId } }),
      this.userRepository.findOne({ where: { id: inviteeId } }),
    ]);
  
    if (!inviter || !invitee) {
      throw new BadRequestException('초대한 사용자 또는 초대받은 사용자가 존재하지 않습니다.');
    }
  
    const existing = await this.rewardRepository.findOne({
      where: {
        userId: inviterId,
        rewardType: REWARD_TYPE.INVITE,
        reason: `invited_${inviteeId}`,
      },
    });
  
    if (existing) {
      this.logger.warn(`중복 리워드 방지: ${inviterId} -> ${inviteeId}`);
      return;
    }
  
    await this.dataSource.transaction(async (manager) => {
      const inviterReward = manager.create(Reward, {
        userId: inviterId,
        rewardType: REWARD_TYPE.INVITE,
        amount: this.INVITER_REWARD_AMOUNT,
        reason: `invited_${inviteeId}`,
      });
  
      const inviteeReward = manager.create(Reward, {
        userId: inviteeId,
        rewardType: REWARD_TYPE.INVITED,
        amount: this.INVITEE_REWARD_AMOUNT,
        reason: `used_invite_${inviterId}`,
      });
  
      await manager.save([inviterReward, inviteeReward]);
  
      // 👉 트랜잭션 안에서 월렛 보상
      await this.walletsService.increaseBalanceWithLog(
        inviterId,
        this.INVITER_REWARD_AMOUNT,
        WALLET_ACTION_TYPE.REFERRAL_REWARD,
        `추천 보상 (피추천자: ${inviteeId})`,
        WALLET_REF_TYPE.REFERRAL,
        inviteeId,
        manager,
      );
  
      await this.walletsService.increaseBalanceWithLog(
        inviteeId,
        this.INVITEE_REWARD_AMOUNT,
        WALLET_ACTION_TYPE.WELCOME_REWARD,
        `가입 보상 (추천인: ${inviterId})`,
        WALLET_REF_TYPE.REFERRAL,
        inviterId,
        manager,
      );
    });
  
    this.logger.log(`리워드 지급 완료: ${inviterId} -> ${inviteeId}`);
  }

  async getRewardsByUser(userId: number): Promise<Reward[]> {
    return this.rewardRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
