// src/wallets/dto/withdraw.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class WithdrawDto {
  @ApiProperty({ example: 3000, description: '인출할 금액' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: '인출 금액은 0보다 커야 합니다.' })
  amount: number;
}
