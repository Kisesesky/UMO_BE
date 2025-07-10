// src/wallets/dto/deposit.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class DepositDto {
  @ApiProperty({ example: 5000, description: '충전할 금액' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: '충전 금액은 0보다 커야 합니다.' })
  amount: number;
}
