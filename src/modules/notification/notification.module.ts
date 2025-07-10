// src/modules/notification/notification.module.ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationService } from './notification.service';
import { NotificationScheduler } from './notification.scheduler';
import { WeatherModule } from '../weather/weather.module';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    WeatherModule,
    WebsocketModule,
  ],
  providers: [NotificationService, NotificationScheduler],
  exports: [NotificationService],
})
export class NotificationModule {}