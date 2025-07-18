// src/modules/locations/dto/location-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Location } from '../entities/location.entity';

export class LocationResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() latitude: number;
  @ApiProperty() longitude: number;
  @ApiProperty() createdAt: Date;

  constructor(loc: Location) {
    this.id = loc.id;
    this.latitude = loc.latitude;
    this.longitude = loc.longitude;
    this.createdAt = loc.createdAt;
  }
}
