// src/modules/websocket/events/websocket-events.ts
export enum WebsocketEvents {
  // 우산 관련 이벤트
  UMBRELLA_STATUS_UPDATED = 'umbrella:status:updated',
  UMBRELLA_LOCATION_UPDATED = 'umbrella:location:updated',
  
  // 대여소 관련 이벤트
  STATION_UMBRELLA_COUNT_UPDATED = 'station:umbrellaCount:updated',
  
  // 연결 관련 이벤트
  CLIENT_CONNECTED = 'client:connected',
  CLIENT_DISCONNECTED = 'client:disconnected',
  
  // 구독 관련 이벤트
  SUBSCRIBE_TO_UMBRELLA = 'subscribe:umbrella',
  SUBSCRIBE_TO_STATION = 'subscribe:station',

  // 알림 관련 이벤트 추가
  NOTIFICATION = 'notification',
}