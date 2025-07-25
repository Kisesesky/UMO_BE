// src/rentals/dto/rental-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { RentalStatus, RENTAL_STATUS, RENTAL_STATUS_VALUES } from '../constants/rental-status';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { Rental } from '../entities/rental.entity';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { UmbrellaResponseDto } from '../../umbrellas/dto/umbrella-response.dto';

export class RentalResponseDto extends BaseResponseDto {
  @ApiProperty({ example: '2023-10-26T10:00:00.000Z', description: '대여 시작 시간 (ISO 8601 형식)' })
  rentalStart: Date;

  @ApiProperty({ example: '2023-10-26T12:30:00.000Z', description: '대여 종료 시간 (반납 시, ISO 8601 형식)', nullable: true })
  rentalEnd: Date;

  @ApiProperty({ example: RENTAL_STATUS.RENTED, enum: RENTAL_STATUS_VALUES, description: '대여 상태' })
  status: RentalStatus;

  @ApiProperty({ example: 2500.50, description: '총 대여 요금 (반납 시 계산)', nullable: true })
  totalFee: number;

  @ApiProperty({ example: 1, description: '우산을 대여한 대여소 ID' })
  rentalStationId: number;

  @ApiProperty({ example: 2, description: '우산을 반납한 대여소 ID', nullable: true })
  returnStationId: number;

  @ApiProperty({ example: { id: 1, name: '김철수' }, description: '대여한 사용자 정보', nullable: true })
  user: UserResponseDto | null;

  @ApiProperty({ example: { id: 101, name: '빨간 우산', rentalFeePerHour: 1000 }, description: '대여된 우산 정보', nullable: true })
  umbrella: UmbrellaResponseDto | null;

  constructor(rental: Rental) {
    super(rental);
    this.rentalStart = rental.rentalStart;
    this.rentalEnd = rental.rentalEnd;
    this.status = rental.status;
    this.totalFee = rental.totalFee;
    this.rentalStationId = rental.rentalStationId;
    this.returnStationId = rental.returnStationId;
    this.user = rental.user ? new UserResponseDto(rental.user) : null;
    this.umbrella = rental.umbrella ? new UmbrellaResponseDto(rental.umbrella) : null;
  }
}
