// src/modules/websocket/websocket.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { UmbrellaUpdateDto } from './dto/umbrella-update.dto';
import { StationUpdateDto } from './dto/station-update.dto';
import { WebsocketEvents } from './events/websocket-event';

@WebSocketGateway({
  cors: {
    origin: '*', // 개발 환경에서는 모든 출처 허용, 운영 환경에서는 특정 도메인으로 제한해야 함
  },
})
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(WebsocketGateway.name);

  @WebSocketServer()
  server: Server;

  // 클라이언트 연결 관리를 위한 맵
  private umbrellaSubscribers: Map<number, string[]> = new Map(); // umbrellaId -> socketIds[]
  private stationSubscribers: Map<number, string[]> = new Map(); // stationId -> socketIds[]

  afterInit(server: Server) {
    this.logger.log('WebSocket 서버 초기화 완료');
  }

  handleConnection(client: Socket) {
    this.logger.log(`클라이언트 연결됨: ${client.id}`);
    client.emit(WebsocketEvents.CLIENT_CONNECTED, { message: '웹소켓 서버에 연결되었습니다.' });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`클라이언트 연결 해제: ${client.id}`);
    // 연결 해제 시 구독 정보에서 해당 클라이언트 제거
    this.removeClientFromAllSubscriptions(client.id);
  }

  // 클라이언트가 특정 우산 상태 변화를 구독
  @SubscribeMessage(WebsocketEvents.SUBSCRIBE_TO_UMBRELLA)
  handleSubscribeToUmbrella(client: Socket, umbrellaId: number) {
    this.logger.log(`클라이언트 ${client.id}가 우산 ${umbrellaId} 구독`);
    
    if (!this.umbrellaSubscribers.has(umbrellaId)) {
      this.umbrellaSubscribers.set(umbrellaId, []);
    }
    
    const subscribers = this.umbrellaSubscribers.get(umbrellaId) || [];
    if (!subscribers.includes(client.id)) {
      subscribers.push(client.id);
    }
    
    return { event: WebsocketEvents.SUBSCRIBE_TO_UMBRELLA, data: { umbrellaId, success: true } };
  }

    // 클라이언트가 특정 대여소 상태 변화를 구독
    @SubscribeMessage(WebsocketEvents.SUBSCRIBE_TO_STATION)
    handleSubscribeToStation(client: Socket, stationId: number) {
      this.logger.log(`클라이언트 ${client.id}가 대여소 ${stationId} 구독`);
      
      if (!this.stationSubscribers.has(stationId)) {
        this.stationSubscribers.set(stationId, []);
      }
      
      const subscribers = this.stationSubscribers.get(stationId) || [];
      if (!subscribers.includes(client.id)) {
        subscribers.push(client.id);
      }
      
      return { event: WebsocketEvents.SUBSCRIBE_TO_STATION, data: { stationId, success: true } };
    }
  
    // 우산 상태 업데이트 이벤트 발송 (다른 서비스에서 호출)
    sendUmbrellaUpdate(umbrellaUpdate: UmbrellaUpdateDto) {
      this.logger.log(`우산 ${umbrellaUpdate.id} 상태 업데이트: ${umbrellaUpdate.status}`);
      
      // 해당 우산을 구독한 클라이언트들에게 이벤트 발송
      const subscribers = this.umbrellaSubscribers.get(umbrellaUpdate.id) || [];
      
      if (subscribers.length > 0) {
        subscribers.forEach(socketId => {
          const socket = this.server.sockets.sockets.get(socketId);
          if (socket) {
            socket.emit(WebsocketEvents.UMBRELLA_STATUS_UPDATED, umbrellaUpdate);
          }
        });
      }
      
      // 우산이 특정 대여소에 있다면, 해당 대여소를 구독한 클라이언트들에게도 알림
      if (umbrellaUpdate.stationId) {
        this.sendStationUpdate({
          id: umbrellaUpdate.stationId,
          umbrellaCount: null, // 이 값은 StationsService에서 계산해서 채워야 함
          availableUmbrellaCount: null, // 이 값은 StationsService에서 계산해서 채워야 함
          updatedAt: new Date()
        });
      }
    }
  
    // 대여소 우산 개수 업데이트 이벤트 발송 (다른 서비스에서 호출)
    sendStationUpdate(stationUpdate: StationUpdateDto) {
      this.logger.log(`대여소 ${stationUpdate.id} 우산 개수 업데이트: ${stationUpdate.umbrellaCount}`);
      
      // 해당 대여소를 구독한 클라이언트들에게 이벤트 발송
      const subscribers = this.stationSubscribers.get(stationUpdate.id) || [];
      
      if (subscribers.length > 0) {
        subscribers.forEach(socketId => {
          const socket = this.server.sockets.sockets.get(socketId);
          if (socket) {
            socket.emit(WebsocketEvents.STATION_UMBRELLA_COUNT_UPDATED, stationUpdate);
          }
        });
      }
    }
  
    // 클라이언트 연결 해제 시 모든 구독에서 제거
    private removeClientFromAllSubscriptions(socketId: string) {
      // 우산 구독 목록에서 제거
      this.umbrellaSubscribers.forEach((subscribers, umbrellaId) => {
        const index = subscribers.indexOf(socketId);
        if (index !== -1) {
          subscribers.splice(index, 1);
          if (subscribers.length === 0) {
            this.umbrellaSubscribers.delete(umbrellaId);
          }
        }
      });
      
      // 대여소 구독 목록에서 제거
      this.stationSubscribers.forEach((subscribers, stationId) => {
        const index = subscribers.indexOf(socketId);
        if (index !== -1) {
          subscribers.splice(index, 1);
          if (subscribers.length === 0) {
            this.stationSubscribers.delete(stationId);
          }
        }
      });
    }
  }