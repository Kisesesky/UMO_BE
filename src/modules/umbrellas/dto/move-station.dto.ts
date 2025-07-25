// src/modules/umbrellas/dto/move-station.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class MoveStationDto {
  @ApiProperty({ example: 1, description: '이동할 대여소 ID' })
  @IsNotEmpty()
  @IsNumber()
  stationId: number;
}
