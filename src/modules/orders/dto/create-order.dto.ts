// src/modules/orders/dto/create-order.dto.ts
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ description: '구매할 상품 ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  productId: number;
}