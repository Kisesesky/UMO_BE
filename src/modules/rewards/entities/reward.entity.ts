// src/modules/rewards/entities/reward.entity.ts
import { User } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RewardType } from "../constants/reward-types";
import { REWARD_TYPE } from './../constants/reward-types';

@Entity('rewards')
export class RewardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'enum', enum: REWARD_TYPE, default: REWARD_TYPE.NONE })
  rewardType: RewardType;

  @Column({ type: 'int', default: 0 })
  amount: number;

  @Column({ unique: true })
  reason: string;

  @CreateDateColumn()
  createdAt: Date;
}
