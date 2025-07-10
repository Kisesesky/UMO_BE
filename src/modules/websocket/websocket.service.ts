// src/modules/websocket/websocket.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { UmbrellaUpdateDto } from './dto/umbrella-update.dto';
import { StationUpdateDto } from './dto/station-update.dto';
import { StationsService } from '../stations/stations.service';
import { WebsocketEvents } from './events/websocket-event';

@Injectable()
export class WebsocketService {
  private readonly logger = new Logger(WebsocketService.name);

  constructor(
    private readonly websocketGateway: WebsocketGateway,
    private readonly stationsService: StationsService,
  ) {}

  // 우산 상태 업데이트 이벤트 발송
  async sendUmbrellaUpdate(umbrellaUpdate: UmbrellaUpdateDto) {
    this.websocketGateway.sendUmbrellaUpdate(umbrellaUpdate);
  }

  // 대여소 우산 개수 업데이트 이벤트 발송
  async sendStationUpdate(stationId: number) {
    try {
      // 대여소의 현재 우산 개수 조회
      const umbrellaCount = await this.stationsService.getUmbrellaCount(stationId);
      
      // 대여 가능한 우산 개수 조회 (AVAILABLE 상태인 우산만)
      const availableUmbrellas = await this.stationsService.getUmbrellasInStation(stationId);
      const availableUmbrellaCount = availableUmbrellas.length;
      
      const stationUpdate: StationUpdateDto = {
        id: stationId,
        umbrellaCount,
        availableUmbrellaCount,
        updatedAt: new Date()
      };
      
      this.websocketGateway.sendStationUpdate(stationUpdate);
    } catch (error) {
      this.logger.error(`대여소 ${stationId} 우산 개수 업데이트 중 오류 발생: ${error.message}`, error.stack);
    }
  }

  async sendNotification(notification: any): Promise<void> {
    this.logger.log(`알림 전송: ${notification.title}`);
    this.websocketGateway.server.emit(WebsocketEvents.NOTIFICATION, notification);
  }
}