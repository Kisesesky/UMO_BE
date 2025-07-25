// src/modules/products/products.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { ErrorResponseDto } from '../../common/dto/error-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PRODUCT_TYPE, ProductType } from './types/product-types';
import { CURRENCY_TYPE, CurrencyType } from './types/currency-types';
import { USER_ROLE } from 'src/modules/users/constants/user-role';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: '모든 상품 조회', description: '활성화된 모든 상품을 조회합니다.' })
  @ApiResponse({ status: 200, description: '상품 목록 조회 성공', type: [ProductResponseDto] })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productsService.findAll();
    return products.map(product => new ProductResponseDto(product));
  }

  @Get('type/:productType')
  @ApiOperation({ summary: '상품 유형별 조회', description: '특정 유형의 상품을 조회합니다.' })
  @ApiParam({ name: 'productType', enum: PRODUCT_TYPE, description: '상품 유형 (PASS, CATNIP_ITEM, MD)' })
  @ApiResponse({ status: 200, description: '상품 유형별 조회 성공', type: [ProductResponseDto] })
  @ApiResponse({ status: 400, description: '유효하지 않은 상품 유형', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async findByType(@Param('productType') productType: string): Promise<ProductResponseDto[]> {
    if (Object.values(PRODUCT_TYPE).includes(productType as any)) {
      const products = await this.productsService.findByType(productType as ProductType);
      return products.map(product => new ProductResponseDto(product));
    }
    throw new BadRequestException(`유효하지 않은 상품 유형입니다: ${productType}`);
  }

  @Get('currency/:currencyType')
  @ApiOperation({ summary: '결제 화폐별 조회', description: '특정 결제 화폐로 구매 가능한 상품을 조회합니다.' })
  @ApiParam({ name: 'currencyType', enum: CURRENCY_TYPE, description: '결제 화폐 유형 (CHURU, CATNIP, REAL_MONEY)' })
  @ApiResponse({ status: 200, description: '결제 화폐별 조회 성공', type: [ProductResponseDto] })
  @ApiResponse({ status: 400, description: '유효하지 않은 화폐 유형', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async findByCurrency(@Param('currencyType') currencyType: string): Promise<ProductResponseDto[]> {
    if (Object.values(CURRENCY_TYPE).includes(currencyType as any)) {
      const products = await this.productsService.findByCurrency(currencyType as CurrencyType);
      return products.map(product => new ProductResponseDto(product));
    }
    throw new BadRequestException(`유효하지 않은 화폐 유형입니다: ${currencyType}`);
  }

  @Get(':id')
  @ApiOperation({ summary: '단일 상품 조회', description: '특정 ID의 상품을 조회합니다.' })
  @ApiParam({ name: 'id', description: '상품 ID' })
  @ApiResponse({ status: 200, description: '상품 조회 성공', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: '상품을 찾을 수 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async findOne(@Param('id') id: number): Promise<ProductResponseDto> {
    const product = await this.productsService.findOne(id);
    return new ProductResponseDto(product);
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_ROLE.ADMIN) // 관리자만 상품 생성 가능
  @ApiOperation({ summary: '상품 생성', description: '새로운 상품을 생성합니다. (관리자 권한 필요)' })
  @ApiResponse({ status: 201, description: '상품 생성 성공', type: ProductResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async create(@Body() createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    const product = await this.productsService.create(createProductDto);
    return new ProductResponseDto(product);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_ROLE.ADMIN) // 관리자만 상품 수정 가능
  @ApiOperation({ summary: '상품 정보 수정', description: '특정 상품의 정보를 수정합니다. (관리자 권한 필요)' })
  @ApiParam({ name: 'id', description: '상품 ID' })
  @ApiResponse({ status: 200, description: '상품 수정 성공', type: ProductResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '상품을 찾을 수 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
    const product = await this.productsService.update(id, updateProductDto);
    return new ProductResponseDto(product);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_ROLE.ADMIN) // 관리자만 상품 삭제 가능 (비활성화)
  @ApiOperation({ summary: '상품 삭제 (비활성화)', description: '특정 상품을 비활성화합니다. (관리자 권한 필요)' })
  @ApiParam({ name: 'id', description: '상품 ID' })
  @ApiResponse({ status: 200, description: '상품 비활성화 성공', type: ProductResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '상품을 찾을 수 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async remove(@Param('id') id: number): Promise<ProductResponseDto> {
    const product = await this.productsService.remove(id);
    return new ProductResponseDto(product);
  }
}