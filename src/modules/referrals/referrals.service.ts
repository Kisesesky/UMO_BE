// src/modules/referrals/referrals.service.ts
import { Injectable, BadRequestException, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Referral } from './entities/referral.entity';
import { User } from '../users/entities/user.entity';
import { InviteCode } from '../invites/entities/invite-code.entity';

@Injectable()
export class ReferralsService {
  private readonly logger = new Logger(ReferralsService.name);

  constructor(
    @InjectRepository(Referral)
    private readonly referralRepository: Repository<Referral>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(InviteCode)
    private readonly inviteCodeRepository: Repository<InviteCode>,
  ) {}

  async createReferral(
    referredUserId: number,
    referralCode: string,
    signUpIp: string,
  ): Promise<Referral> {
    const referred = await this.userRepository.findOne({ where: { id: referredUserId } });
    if (!referred) {
      this.logger.warn(`Referred user not found: id=${referredUserId}`);
      throw new NotFoundException('추천받는 유저를 찾을 수 없습니다.');
    }

    const inviteCode = await this.inviteCodeRepository.findOne({
      where: { code: referralCode },
      relations: ['owner'],
    });
    if (!inviteCode || !inviteCode.owner) {
      this.logger.warn(`Invalid invite code used: code=${referralCode}`);
      throw new NotFoundException('유효하지 않은 추천코드입니다.');
    }

    if (inviteCode.owner.id === referred.id) {
      throw new BadRequestException('자기 자신을 추천할 수 없습니다.');
    }

    // 중복 추천 체크
    const existingReferral = await this.referralRepository.findOne({
      where: {
        referrer: { id: inviteCode.owner.id },
        referred: { id: referred.id },
      },
    });
    if (existingReferral) {
      throw new ConflictException('이미 추천 기록이 존재합니다.');
    }

    // IP 중복 제한
    const existingIpReferral = signUpIp
      ? await this.referralRepository.findOne({
          where: { referrer: inviteCode.owner, signUpIp },
        })
      : null;

    const rewardGiven = existingIpReferral ? false : true;

    const referral = this.referralRepository.create({
      referrer: inviteCode.owner,
      referred,
      inviteCode,
      rewardGiven,
      rewardStage: rewardGiven ? 'signup' : 'none',
      signUpIp,
    });

    this.logger.log(
      `Referral created: referrerId=${inviteCode.owner.id}, referredId=${referred.id}, rewardGiven=${rewardGiven}`,
    );

    return this.referralRepository.save(referral);
  }

  async setRewardGiven(referralId: number): Promise<void> {
    const referral = await this.referralRepository.findOne({ where: { id: referralId } });
    if (!referral) {
      throw new NotFoundException('추천 기록을 찾을 수 없습니다.');
    }
    referral.rewardGiven = true;
    referral.rewardStage = 'action';
    await this.referralRepository.save(referral);
    this.logger.log(`Reward marked as given for referral id=${referralId}`);
  }

  async getReferralsByReferrer(referrerId: number): Promise<Referral[]> {
    return this.referralRepository.find({
      where: { referrer: { id: referrerId } },
      relations: ['referrer', 'referred', 'inviteCode'],
      order: { createdAt: 'DESC' },
    });
  }

  async getReferralsByReferred(referredId: number): Promise<Referral[]> {
    return this.referralRepository.find({
      where: { referred: { id: referredId } },
      relations: ['referrer', 'referred', 'inviteCode'],
      order: { createdAt: 'DESC' },
    });
  }

  async getTopReferrers(limit = 10): Promise<{ referrerId: number; count: number }[]> {
    return this.referralRepository
      .createQueryBuilder('referral')
      .leftJoin('referral.referrer', 'user')
      .select('user.id', 'referrerId')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.id')
      .orderBy('count', 'DESC')
      .limit(limit)
      .getRawMany();
  }
}
