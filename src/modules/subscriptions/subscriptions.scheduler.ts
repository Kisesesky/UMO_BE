// src/modules/subscriptions/subscriptions.scheduler.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscriptionsService } from './subscriptions.service';

@Injectable()
export class SubscriptionsScheduler {
  private readonly logger = new Logger(SubscriptionsScheduler.name);

  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  // 매일 자정 1분 후에 만료된 이용권 상태 업데이트
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // 또는 '0 1 0 * * *' (매일 0시 1분)
  async handleExpiredSubscriptions() {
    this.logger.log('만료된 이용권 상태 업데이트 스케줄러 실행');
    try {
      const affectedRows = await this.subscriptionsService.expireSubscriptions();
      this.logger.log(`만료된 이용권 ${affectedRows}개 업데이트 완료.`);
    } catch (error) {
      this.logger.error(`만료된 이용권 업데이트 중 오류 발생: ${error.message}`, error.stack);
    }
  }
}