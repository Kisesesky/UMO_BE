// src/modules/products/dto/product-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/dto/base-response.dto';
import { PRODUCT_TYPE, ProductType } from '../types/product-types';
import { CURRENCY_TYPE, CurrencyType } from '../types/currency-types';

export class ProductResponseDto extends BaseResponseDto {
  constructor(entity?: any) {
    super(entity || {});
  }

  @ApiProperty({ description: '상품 이름', example: '7일 이용권' })
  name: string;

  @ApiProperty({ description: '상품 설명', example: '7일간 무제한 우산 대여 가능', nullable: true })
  description: string;

  @ApiProperty({ description: '상품 가격', example: 500 })
  price: number;

  @ApiProperty({ description: '상품 유형', enum: PRODUCT_TYPE, example: PRODUCT_TYPE.PASS })
  productType: ProductType;

  @ApiProperty({ description: '결제 화폐 유형', enum: CURRENCY_TYPE, example: CURRENCY_TYPE.CHURU })
  currencyType: CurrencyType;

  @ApiProperty({ description: '이용권 기간 (일)', example: 7, nullable: true })
  durationDays: number;

  @ApiProperty({ description: '상품 이미지 URL', example: 'https://example.com/pass_7day.png', nullable: true })
  imageUrl: string;

  @ApiProperty({ description: '상품 활성화 여부', example: true })
  isActive: boolean;
}