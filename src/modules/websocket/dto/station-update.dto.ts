// src/modules/websocket/dto/station-update.dto.ts
export class StationUpdateDto {
  id: number;
  umbrellaCount: number | null;
  availableUmbrellaCount: number | null;
  updatedAt: Date;
}
