// src/modules/wallets/entities/wallet.entity.ts
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { WalletLogs } from '../wallet-logs/entities/wallet-log.entity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ type: 'int', default: 0, name: 'churu_balance' })
  churuBalance: number; // 츄르 잔액

  @Column({ type: 'int', default: 0, name: 'catnip_balance' })
  catnipBalance: number; // 캣닢 잔액

  @Column({ unique: true, name: 'user_id' })
  userId: number;

  @OneToOne(() => User, user => user.wallet, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => WalletLogs, walletlogs => walletlogs.wallet, {
     onDelete: 'CASCADE'
  })
  walletlogs: WalletLogs[];
  
  @CreateDateColumn()
  createdAt: Date;
}
