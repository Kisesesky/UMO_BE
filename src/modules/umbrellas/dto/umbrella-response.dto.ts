// src/modules/umbrellas/dto/umbrella-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { UmbrellaStatus, UMBRELLA_STATUS, UMBRELLA_STATUS_VALUES } from '../constants/umbrella-status';
import { Umbrella } from '../entities/umbrella.entity';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';

export class UmbrellaResponseDto extends BaseResponseDto {
  @ApiProperty({ example: 'UM-001', description: '우산 코드' })
  code: string;

  @ApiProperty({ example: UMBRELLA_STATUS.AVAILABLE, enum: UMBRELLA_STATUS_VALUES, description: '우산 상태' })
  status: UmbrellaStatus;

  @ApiProperty({ example: false, description: '분실 여부' })
  isLost: boolean;

  @ApiProperty({ example: 1000, description: '시간당 대여 요금 (원)' })
  rentalFeePerHour: number;

  @ApiProperty({ example: 15000, description: '우산 가격 (분실 시 배상금 계산용)' })
  price: number;

  @ApiProperty({ example: 1, description: '현재 위치한 대여소 ID', nullable: true })
  stationId: number;

  constructor(umbrella: Umbrella) {
    super(umbrella);
    this.code = umbrella.code;
    this.status = umbrella.status;
    this.isLost = umbrella.isLost;
    this.rentalFeePerHour = umbrella.rentalFeePerHour;
    this.price = umbrella.price;
    this.stationId = umbrella.stationId;
  }
}
