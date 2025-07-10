// src/modules/notification/notification.scheduler.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationScheduler {
  private readonly logger = new Logger(NotificationScheduler.name);

  // 알림을 보낼 기본 위치 (NotificationService의 기본값과 일치)
  private readonly DEFAULT_NX = 98;
  private readonly DEFAULT_NY = 76;

  constructor(private readonly notificationService: NotificationService) {}

  // 매일 아침 7시에 날씨 알림 발송
  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  async sendMorningWeatherNotification() {
    this.logger.log('아침 날씨 알림 스케줄러 실행');
    await this.notificationService.sendWeatherNotification(this.DEFAULT_NX, this.DEFAULT_NY);
  }

  // 매일 오후 5시에 저녁 날씨 알림 발송 (선택 사항, 필요에 따라 활성화)
  // @Cron(CronExpression.EVERY_DAY_AT_5PM)
  // async sendEveningWeatherNotification() {
  //   this.logger.log('저녁 날씨 알림 스케줄러 실행');
  //   await this.notificationService.sendWeatherNotification(this.DEFAULT_NX, this.DEFAULT_NY);
  // }
}