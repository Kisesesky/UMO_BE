// src/modules/products/dto/create-product.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional, IsBoolean, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PRODUCT_TYPE, ProductType } from '../../../common/types/product-types';
import { CURRENCY_TYPE, CurrencyType } from '../../../common/types/currency-types';


export class CreateProductDto {
  @ApiProperty({ description: '상품 이름', example: '7일 이용권' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '상품 설명', example: '7일간 무제한 우산 대여 가능' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '상품 가격', example: 500 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: '상품 유형', enum: PRODUCT_TYPE, example: PRODUCT_TYPE.PASS })
  @IsNotEmpty()
  @IsEnum(PRODUCT_TYPE)
  productType: ProductType;

  @ApiProperty({ description: '결제 화폐 유형', enum: CURRENCY_TYPE, example: CURRENCY_TYPE.CHURU })
  @IsNotEmpty()
  @IsEnum(CURRENCY_TYPE)
  currencyType: CurrencyType;

  @ApiProperty({ description: '이용권 기간 (일)', example: 7, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  durationDays?: number;

  @ApiProperty({ description: '상품 이미지 URL', example: 'https://example.com/image.jpg', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: '상품 활성화 여부', example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}