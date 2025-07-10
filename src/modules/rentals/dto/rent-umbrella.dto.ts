// src/rentals/dto/rent-umbrella.dto.ts
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RentUmbrellaDto {
  @ApiProperty({ description: '대여할 우산 ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  umbrellaId: number;
}