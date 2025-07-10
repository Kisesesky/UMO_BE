// src/modules/payments/dto/verify-payment-request.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class VerifyPaymentRequestDto {
  @ApiProperty({ description: '아임포트 결제 고유 ID', example: 'imp_123456789' })
  @IsNotEmpty()
  @IsString()
  imp_uid: string;

  @ApiProperty({ description: '가맹점 주문 번호', example: 'merchant_123456789' })
  @IsNotEmpty()
  @IsString()
  merchant_uid: string;

  @ApiProperty({ description: '결제 금액', example: 10000 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}