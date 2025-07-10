// src/modules/websocket/dto/umbrella-update.dto.ts
import { UMBRELLA_STATUS, UmbrellaStatus } from 'src/common/constants/umbrella-status';

export class UmbrellaUpdateDto {
  id: number;
  status: UmbrellaStatus;
  stationId?: number | null;
  latitude?: number;
  longitude?: number;
  updatedAt: Date;
}