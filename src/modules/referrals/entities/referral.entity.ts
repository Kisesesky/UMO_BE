// src/modules/referrals/entities/referral.entity.ts
import { InviteCode } from "src/modules/invites/entities/invite-code.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { RewardStage, REWARD_STAGE, REWARD_STAGE_VALUES } from './../constants/reward-stage';

@Entity('referrals')
@Unique(['referrer', 'referred']) // 동일 추천|피추천 이중 기록 방지
export class Referral {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.referrals , { eager: true })
  referrer: User; // 추천인

  @ManyToOne(() => User, user => user.referred, { eager: true })
  referred: User; // 피추천인

  @ManyToOne(() => InviteCode, { eager: true, nullable: false })
  inviteCode: InviteCode; // 사용한 초대코드

  @Column({ default: false })
  rewardGiven: boolean;

  @Column({ type: 'enum', enum: REWARD_STAGE, default: REWARD_STAGE.NONE })
  rewardStage: RewardStage;

  @Column({ nullable: true })
  signUpIp?: string;

  @CreateDateColumn()
  createdAt: Date;
}
