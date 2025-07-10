// src/rentals/dto/return-umbrella.dto.ts
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReturnUmbrellaDto {
  @ApiProperty({ description: '우산을 반납할 대여소의 ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  stationId: number;
}
