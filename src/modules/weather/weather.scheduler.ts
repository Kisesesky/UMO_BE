// src/modules/weather/weather.scheduler.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WeatherService } from './services/weather.service';

@Injectable()
export class WeatherScheduler {
  private readonly logger = new Logger(WeatherScheduler.name);

  constructor(private readonly weatherService: WeatherService) {}

  // 매일 아침 6시 10분에 중기예보 데이터 업데이트 (기상청 발표 시간 06시 이후)
  @Cron('0 10 6 * * *')
  async updateMorningForecast() {
    this.logger.log('아침 중기예보 데이터 업데이트 스케줄러 실행');
    try {
      await this.weatherService.getMidtermForecast();
      this.logger.log('아침 중기예보 데이터 업데이트 완료');
    } catch (error) {
      this.logger.error(`아침 중기예보 데이터 업데이트 실패: ${error.message}`, error.stack);
    }
  }

  // 매일 저녁 6시 10분에 중기예보 데이터 업데이트 (기상청 발표 시간 18시 이후)
  @Cron('0 10 18 * * *')
  async updateEveningForecast() {
    this.logger.log('저녁 중기예보 데이터 업데이트 스케줄러 실행');
    try {
      await this.weatherService.getMidtermForecast();
      this.logger.log('저녁 중기예보 데이터 업데이트 완료');
    } catch (error) {
      this.logger.error(`저녁 중기예보 데이터 업데이트 실패: ${error.message}`, error.stack);
    }
  }
}