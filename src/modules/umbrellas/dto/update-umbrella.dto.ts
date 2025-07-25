// src/modules/umbrellas/dto/update-umbrella.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { UmbrellaStatus } from '../constants/umbrella-status';
import { UMBRELLA_STATUS_VALUES } from '../constants/umbrella-status';

export class UpdateUmbrellaDto {
  @ApiProperty({ example: 'UM-001', description: '우산 코드', required: false })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ example: 'AVAILABLE', enum: UMBRELLA_STATUS_VALUES, description: '우산 상태', required: false })
  @IsOptional()
  @IsEnum(UMBRELLA_STATUS_VALUES)
  status?: UmbrellaStatus;

  @ApiProperty({ example: 1000, description: '시간당 대여 요금 (원)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  rentalFeePerHour?: number;

  @ApiProperty({ example: 15000, description: '우산 가격 (분실 시 배상금 계산용)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({ example: 1, description: '현재 위치한 대여소 ID', required: false })
  @IsOptional()
  @IsNumber()
  stationId?: number;
}
