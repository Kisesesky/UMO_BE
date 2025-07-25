// src/wallets/wallets.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { Wallet } from './entities/wallet.entity';
import { WalletLogs } from './wallet-logs/entities/wallet-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Wallet, 
    WalletLogs
  ])],
  controllers: [WalletsController],
  providers: [WalletsService],
  exports: [WalletsService],
})
export class WalletsModule {}
