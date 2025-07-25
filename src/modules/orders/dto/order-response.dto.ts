// src/modules/orders/dto/order-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/dto/base-response.dto';
import { ORDER_STATUS } from '../constants/order-status';

export class OrderResponseDto extends BaseResponseDto {
  constructor(entity?: any) {
    super(entity || {});
  }

  @ApiProperty({ description: '사용자 ID', example: 1 })
  userId: number;

  @ApiProperty({ description: '상품 ID', example: 1 })
  productId: number;

  @ApiProperty({ description: '주문 상태', enum: ORDER_STATUS, example: ORDER_STATUS.COMPLETED })
  status: string;

  @ApiProperty({ description: '총 결제 금액', example: 500 })
  totalAmount: number;

  @ApiProperty({ description: '주문 완료 시간', example: '2025-07-01T12:00:00Z' })
  completedAt: Date;

  @ApiProperty({ description: '상품 정보', example: { id: 1, name: '7일 이용권', price: 500 } })
  product?: any;
}