// src/modules/websocket/dto/umbrella-update.dto.ts
import { UmbrellaStatus } from "src/modules/umbrellas/constants/umbrella-status";

export class UmbrellaUpdateDto {
  id: number;
  status: UmbrellaStatus;
  stationId?: number | null;
  latitude?: number;
  longitude?: number;
  updatedAt: Date;
}