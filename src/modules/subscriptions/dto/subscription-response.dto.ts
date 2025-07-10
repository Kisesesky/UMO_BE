// src/modules/subscriptions/dto/subscription-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/dto/base-response.dto';
import { SUBSCRIPTION_STATUS } from '../../../common/constants/subscription-status';

export class SubscriptionResponseDto extends BaseResponseDto {
  constructor(entity?: any) {
    super(entity || {});
  }

  @ApiProperty({ description: '사용자 ID', example: 1 })
  userId: number;

  @ApiProperty({ description: '상품 ID', example: 1 })
  productId: number;

  @ApiProperty({ description: '이용권 시작일', example: '2025-07-01T00:00:00Z' })
  startDate: Date;

  @ApiProperty({ description: '이용권 종료일', example: '2025-07-08T00:00:00Z' })
  endDate: Date;

  @ApiProperty({ description: '이용권 상태', enum: SUBSCRIPTION_STATUS, example: SUBSCRIPTION_STATUS.ACTIVE })
  status: string;

  @ApiProperty({ description: '구매한 상품 정보', example: { id: 1, name: '7일 이용권', price: 500 } })
  product?: any;
}