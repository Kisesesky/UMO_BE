// src/modules/payments/payments.service.ts
import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PortOneConfigService } from 'src/config/portone/config.service';
import { WalletsService } from '../wallets/wallets.service';
import { firstValueFrom } from 'rxjs';
import { DataSource } from 'typeorm';
import { PaymentResponseDto } from './dto/payment-response.dto';
import {
  PortOneTokenFailException,
  PortOneTokenErrorException,
  PaymentLookupFailException,
  PaymentNotCompletedException,
  MerchantUidMismatchException,
  AmountMismatchException,
  UnknownPaymentException,
} from 'src/modules/payments/exceptions/payment.exceptions';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private accessToken: string;
  private tokenExpiresAt: number;

  constructor(
    private readonly httpService: HttpService,
    private readonly portoneConfigService: PortOneConfigService,
    private readonly walletsService: WalletsService,
    private readonly dataSource: DataSource,
  ) {}

  private async getIamportAccessToken(): Promise<string> {
    // 토큰이 유효하면 재사용
    if (this.accessToken && this.tokenExpiresAt && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    try {
      this.logger.log('아임포트 Access Token 발급 시도...');
      const response = await firstValueFrom(
        this.httpService.post('https://api.iamport.kr/users/getToken', {
          imp_key: this.portoneConfigService.portoneApiKey,
          imp_secret: this.portoneConfigService.portoneApiSecret,
        }),
      );

      if (response.data.code !== 0) {
        throw new PortOneTokenFailException(response.data.message);
      }

      const tokenInfo = response.data.response;
      this.accessToken = tokenInfo.access_token;
      this.tokenExpiresAt = Date.now() + (tokenInfo.expired_at - tokenInfo.now) * 1000 - 60000; // 만료 1분 전 갱신
      this.logger.log('아임포트 Access Token 발급 성공');
      return this.accessToken;
    } catch (error) {
      this.logger.error(`아임포트 Access Token 발급 중 오류: ${error.message}`, error.stack);
      throw new PortOneTokenErrorException();
    }
  }

  async verifyPaymentAndDepositChuru(imp_uid: string, merchant_uid: string, amount: number, userId: number): Promise<PaymentResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const accessToken = await this.getIamportAccessToken();
      
      // 1. 아임포트 결제 정보 조회
      this.logger.log(`아임포트 결제 정보 조회: imp_uid=${imp_uid}`);
      const paymentResponse = await firstValueFrom(
        this.httpService.get(`https://api.iamport.kr/payments/${imp_uid}`, {
          headers: { Authorization: accessToken },
        }),
      );

      if (paymentResponse.data.response.header.resultCode !== '00') {
        throw new PaymentLookupFailException(paymentResponse.data.message);
      }

      const paymentData = paymentResponse.data.response;
      
      // 2. 결제 상태 및 금액 검증
      if (paymentData.status !== 'paid') {
        throw new PaymentNotCompletedException();
      }
      if (paymentData.merchant_uid !== merchant_uid) {
        throw new MerchantUidMismatchException();
      }
      if (paymentData.amount !== amount) {
        throw new AmountMismatchException();
      }
      
      this.logger.log(`결제 검증 성공: imp_uid=${imp_uid}, amount=${amount}`);

      // 3. 사용자 지갑에 츄르 충전 (트랜잭션 내부에서 실행)
      // 실제 결제 금액에 따라 츄르를 지급하는 로직
      await this.walletsService.depositChuruFromPayment(userId, amount);
      
      await queryRunner.commitTransaction();
      this.logger.log(`사용자 ${userId} 지갑에 ${amount}원 결제 후 츄르 지급 완료.`);
      // return { success: true, message: '결제가 성공적으로 완료되었습니다.', paymentData };
      return new PaymentResponseDto({
        id: 0, // 필요에 따라 적절한 ID 부여
        createdAt: new Date(),
        updatedAt: new Date(),
        success: true,
        message: '결제가 성공적으로 완료되었습니다.',
        paymentData: paymentData,
      });
    
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`결제 검증 및 츄르 지급 중 오류 발생: ${error.message}`, error.stack);
      if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new UnknownPaymentException();
    } finally {
      await queryRunner.release();
    }
  }
}