import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Wallet } from "../../entities/wallet.entity";
import { WalletLogType, WALLET_LOG_TYPE, WALLET_LOG_TYPE_VALUES } from "../../types/logs.type";

@Entity('walletlogs')
export class WalletLogs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: WALLET_LOG_TYPE_VALUES, default: WALLET_LOG_TYPE.CATNIP })
  assetType: WalletLogType;

  @Column({ type: 'int' })
  amount: number;

  @Column({ length: 32 })
  action: string;

  @Column({ nullable: true })
  refType?: string;

  @Column({ nullable: true })
  refId?: number;

  @ManyToOne(() => Wallet, wallet => wallet.walletlogs, {
    onDelete: 'CASCADE'
 })
  wallet: Wallet;
  
  @CreateDateColumn()
  createdAt: Date;
}
