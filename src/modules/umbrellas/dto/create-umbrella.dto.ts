// src/modules/umbrellas/dto/create-umbrella.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min, IsOptional } from 'class-validator';

export class CreateUmbrellaDto {
  @ApiProperty({ example: 'UM-001', description: '우산 코드' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ example: 1000, description: '시간당 대여 요금 (원)' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  rentalFeePerHour: number;

  @ApiProperty({ example: 15000, description: '우산 가격 (분실 시 배상금 계산용)' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 1, description: '현재 위치한 대여소 ID', required: false })
  @IsOptional()
  @IsNumber()
  stationId?: number;
}
