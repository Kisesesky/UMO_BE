// src/modules/umbrellas/dto/change-status.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UmbrellaStatus, UMBRELLA_STATUS_VALUES } from '../constants/umbrella-status';

export class UmbrellaChangeStatusDto {
  @ApiProperty({ enum: UMBRELLA_STATUS_VALUES, description: '변경할 우산 상태' })
  @IsNotEmpty()
  @IsEnum(UMBRELLA_STATUS_VALUES)
  status: UmbrellaStatus;
}
