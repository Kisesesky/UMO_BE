// src/modules/wallets/wallets.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletNotFoundException, InsufficientBalanceException, InvalidAmountException } from './exceptions/wallet.exceptions';
import { WalletActionType, WALLET_ACTION_TYPE } from './types/action.type';
import { WALLET_LOG_TYPE } from './types/logs.type';
import { WalletRefType, WALLET_REF_TYPE } from './types/ref.type';
import { WalletLogs } from './wallet-logs/entities/wallet-log.entity';

@Injectable()
export class WalletsService {
  private readonly logger = new Logger(WalletsService.name);

  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(WalletLogs)
    private walletLogsRepository: Repository<WalletLogs>,
    private readonly dataSource: DataSource,
  ) {}

  async findByUserId(userId: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({ where: { userId } });
    if (!wallet) {
      throw new WalletNotFoundException();
    }
    return wallet;
  }

  async createWallet(userId: number): Promise<Wallet> {
    const existingWallet = await this.walletRepository.findOne({ where: { userId } });
    if (existingWallet) {
      return existingWallet;
    }

    const wallet = this.walletRepository.create({
      userId,
      churuBalance: 0,
      catnipBalance: 0,
    });
    return await this.walletRepository.save(wallet);
  }

  async deactivateWallet(userId: number) {
    await this.walletRepository.softDelete({ user: { id: userId } });
  }

  async removeWallet(userId: number): Promise<void> {
    const wallet = await this.walletRepository.findOne({ where: { userId } });
    if (wallet) {
      await this.walletRepository.remove(wallet);
    }
  }

  // --- 츄르 (Churu) 관련 메서드 ---
  async depositChuru(userId: number, amount: number): Promise<Wallet> {
    if (amount <= 0) throw new InvalidAmountException();
    const wallet = await this.findByUserId(userId);
    wallet.churuBalance += amount;
    return await this.walletRepository.save(wallet);
  }

  async withdrawChuru(userId: number, amount: number): Promise<Wallet> {
    if (amount <= 0) throw new InvalidAmountException();
    const wallet = await this.findByUserId(userId);
    if (wallet.churuBalance < amount) throw new InsufficientBalanceException(amount, wallet.churuBalance);
    wallet.churuBalance -= amount;
    return await this.walletRepository.save(wallet);
  }

  async getChuruBalance(userId: number): Promise<number> {
    const wallet = await this.findByUserId(userId);
    return wallet.churuBalance;
  }

  // --- 캣닢 (Catnip) 관련 메서드 ---
  async addCatnip(userId: number, amount: number): Promise<Wallet> {
    if (amount <= 0) throw new InvalidAmountException();
    const wallet = await this.findByUserId(userId);
    wallet.catnipBalance += amount;
    return await this.walletRepository.save(wallet);
  }

  async withdrawCatnip(userId: number, amount: number): Promise<Wallet> {
    if (amount <= 0) throw new InvalidAmountException();
    const wallet = await this.findByUserId(userId);
    if (wallet.catnipBalance < amount) throw new InsufficientBalanceException(amount, wallet.catnipBalance);
    wallet.catnipBalance -= amount;
    return await this.walletRepository.save(wallet);
  }

  async getCatnipBalance(userId: number): Promise<number> {
    const wallet = await this.findByUserId(userId);
    return wallet.catnipBalance;
  }

  /**
   * 실제 결제 금액에 따라 츄르를 지급하고 보너스를 계산합니다.
   * @param userId 사용자 ID
   * @param realMoneyAmount 실제 결제 금액 (원)
   * @returns 업데이트된 지갑 정보
   */
  async depositChuruFromPayment(userId: number, realMoneyAmount: number): Promise<Wallet> {
    if (realMoneyAmount <= 0) throw new InvalidAmountException();

    const wallet = await this.findByUserId(userId);
    let churuToReceive = 0;
    let bonusChuru = 0;

    // 1원 = 0.1츄르 기본 환율 (100원 = 10츄르, 150원 = 15츄르 기준)
    const baseChuru = Math.floor(realMoneyAmount * 0.1); // 1원당 0.1츄르

    // 보너스 츄르 로직
    if (realMoneyAmount >= 50000) { // 50000원 결제시 5000츄르(기본) + 5000츄르(보너스) = 10000츄르
      bonusChuru = baseChuru; // 100% 보너스
    } else if (realMoneyAmount >= 30000) { // 30000원 결제시 3000츄르(기본) + 2100츄르(보너스) = 5100츄르
      bonusChuru = Math.floor(baseChuru * 0.7); // 70% 보너스
    } else if (realMoneyAmount >= 10000) { // 10000원 결제시 1000츄르(기본) + 500츄르(보너스) = 1500츄르
      bonusChuru = Math.floor(baseChuru * 0.5); // 50% 보너스
    } else if (realMoneyAmount >= 5000) { // 5000원 결제시 500츄르(기본) + 150츄르(보너스) = 650츄르
      bonusChuru = Math.floor(baseChuru * 0.3); // 30% 보너스
    } else if (realMoneyAmount >= 3000) { // 3000원 결제시 300츄르(기본) + 30츄르(보너스) = 330츄르
      bonusChuru = Math.floor(baseChuru * 0.1); // 10% 보너스
    }

    churuToReceive = baseChuru + bonusChuru;
    
    wallet.churuBalance += churuToReceive;

    this.logger.log(`사용자 ${userId}: ${realMoneyAmount}원 결제로 ${churuToReceive} 츄르 (기본: ${baseChuru}, 보너스: ${bonusChuru}) 지급 완료.`);
    return await this.walletRepository.save(wallet);
  }

  // 월렛 잔액 및 로그 조회
  async getWallet(userId: number) {
    return this.walletRepository.findOneOrFail({ where: { user: { id: userId } } });
  }

  async getWalletLogs(userId: number, limit = 50) {
    const wallet = await this.walletRepository.findOneOrFail({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!wallet) {
      throw new NotFoundException('지갑 정보를 찾을 수 없습니다.');
    }
  
    return this.walletLogsRepository.find({
      where: { wallet: { id: wallet.id } },
      order: { id: 'DESC' },
      take: limit,
      relations: ['wallet', 'wallet.user'],
    });
  }

  async rewardChuru(
    userId: number,
    amount: number,
    action: WalletActionType = WALLET_ACTION_TYPE.EVENT,
    refType?: WalletRefType,
    refId?: number
  ): Promise<Wallet> {
    if (amount <= 0) throw new InvalidAmountException();
  
    return await this.dataSource.transaction(async manager => {
      const walletRepository = manager.getRepository(Wallet);
      const walletLogRepo = manager.getRepository(WalletLogs);
  
      const wallet = await walletRepository.findOneOrFail({ where: { userId } });
      wallet.churuBalance += amount;
      await walletRepository.save(wallet);
  
      await walletLogRepo.save({
        wallet,
        assetType: WALLET_LOG_TYPE.CHURU,
        amount,
        action,
        refType,
        refId,
      });
  
      return wallet;
    });
  }
  
  // 추천 보상 지급 예시 (트랜잭션 안에서)
  async processReferralReward(
    refereeUserId: number,
    referrerUserId: number,
    refereeRewardAmount: number,
    referrerRewardAmount: number
  ): Promise<void> {
    await this.dataSource.transaction(async manager => {
      const walletRepository = manager.getRepository(Wallet);
      const walletLogRepo = manager.getRepository(WalletLogs);
  
      const refereeWallet = await walletRepository.findOneOrFail({ where: { userId: refereeUserId } });
      const referrerWallet = await walletRepository.findOneOrFail({ where: { userId: referrerUserId } });
  
      // 피추천인 보상 지급
      refereeWallet.churuBalance += refereeRewardAmount;
      await walletRepository.save(refereeWallet);
      await walletLogRepo.save({
        wallet: refereeWallet,
        assetType: WALLET_LOG_TYPE.CHURU,
        amount: refereeRewardAmount,
        action: WALLET_ACTION_TYPE.REFERRAL_REWARD,
        refType: WALLET_REF_TYPE.REFERRAL,
        refId: referrerUserId,
      });
  
      // 추천인 보상 지급
      referrerWallet.churuBalance += referrerRewardAmount;
      await walletRepository.save(referrerWallet);
      await walletLogRepo.save({
        wallet: referrerWallet,
        assetType: WALLET_LOG_TYPE.CHURU,
        amount: referrerRewardAmount,
        action: WALLET_ACTION_TYPE.REFERRAL_REWARD,
        refType: WALLET_REF_TYPE.REFERRAL,
        refId: refereeUserId,
      });
    });
  }

  async increaseBalanceWithLog(
    userId: number,
    amount: number,
    action: WalletActionType,
    description: string,
    refType?: WalletRefType,
    refId?: number,
    manager?: EntityManager
  ): Promise<void> {
    if (amount <= 0) throw new InvalidAmountException();
  
    const repo = manager?.getRepository(Wallet) ?? this.walletRepository;
    const logRepo = manager?.getRepository(WalletLogs) ?? this.walletLogsRepository;
  
    const wallet = await repo.findOneOrFail({ where: { userId } });
    wallet.churuBalance += amount;
    await repo.save(wallet);
  
    await logRepo.save({
      wallet,
      assetType: WALLET_LOG_TYPE.CHURU,
      amount,
      action,
      refType,
      refId,
      description,
    });
  
    this.logger.log(`[${userId}] +${amount} 지급됨. action=${action}, desc=${description}`);
  }
}