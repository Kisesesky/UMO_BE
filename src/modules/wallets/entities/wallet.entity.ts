// src/modules/wallets/entities/wallet.entity.ts
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('wallets')
export class Wallet extends BaseEntity {
  @Column({ type: 'int', default: 0, name: 'churu_balance' })
  churuBalance: number; // 츄르 잔액

  @Column({ type: 'int', default: 0, name: 'catnip_balance' })
  catnipBalance: number; // 캣닢 잔액

  @Column({ unique: true, name: 'user_id' })
  userId: number;

  @OneToOne(() => User, user => user.wallet)
  @JoinColumn({ name: 'user_id' })
  user: User;
}