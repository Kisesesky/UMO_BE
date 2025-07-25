// src/modules/orders/orders.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestUser } from '../../common/decorators/request-user.decorator';
import { UserResponseDto } from '../../modules/users/dto/user-response.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { USER_ROLE } from 'src/modules/users/constants/user-role';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '내 주문 내역 조회', description: '로그인한 사용자의 주문 내역을 조회합니다.' })
  @ApiResponse({ status: 200, description: '주문 내역 조회 성공', type: [OrderResponseDto] })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async findMyOrders(@RequestUser() user: UserResponseDto) {
    const orders = await this.ordersService.findByUserId(user.id);
    return orders.map(order => new OrderResponseDto({
      ...order,
      product: order.product
    }));
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '주문 상세 조회', description: '특정 주문의 상세 정보를 조회합니다.' })
  @ApiParam({ name: 'id', description: '주문 ID', type: Number })
  @ApiResponse({ status: 200, description: '주문 상세 조회 성공', type: OrderResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '주문을 찾을 수 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async findOne(@Param('id') id: number, @RequestUser() user: UserResponseDto) {
    const order = await this.ordersService.findOne(id);
    // 본인의 주문만 조회 가능 (관리자는 모든 주문 조회 가능)
    if (order.userId !== user.id && user.role !== USER_ROLE.ADMIN) {
      throw new ForbiddenException('다른 사용자의 주문을 조회할 권한이 없습니다.');
    }
    return new OrderResponseDto({
      ...order,
      product: order.product
    });
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '상품 구매', description: '상품을 구매하고 주문을 생성합니다.' })
  @ApiResponse({ status: 201, description: '주문 생성 성공', type: OrderResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터 또는 잔액 부족.', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '상품을 찾을 수 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async create(@Body() createOrderDto: CreateOrderDto, @RequestUser() user: UserResponseDto) {
    const order = await this.ordersService.create(user.id, createOrderDto);
    return new OrderResponseDto({
      ...order,
      product: order.product
    });
  }

  // 관리자용 주문 취소/완료 API (선택 사항, 필요시 추가)
  @Post(':id/complete')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_ROLE.ADMIN)
  @ApiOperation({ summary: '주문 완료 처리 (관리자용)', description: '특정 주문을 완료 상태로 변경합니다.' })
  @ApiParam({ name: 'id', description: '주문 ID', type: Number })
  @ApiResponse({ status: 200, description: '주문 완료 처리 성공', type: OrderResponseDto })
  @ApiResponse({ status: 400, description: '이미 처리된 주문이거나 유효하지 않은 상태', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '주문을 찾을 수 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async completeOrder(@Param('id') id: number): Promise<OrderResponseDto> {
    const order = await this.ordersService.completeOrder(id);
    return new OrderResponseDto({ ...order, product: order.product });
  }

  @Post(':id/cancel')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_ROLE.ADMIN)
  @ApiOperation({ summary: '주문 취소 처리 (관리자용)', description: '특정 주문을 취소 상태로 변경하고 환불 처리합니다.' })
  @ApiParam({ name: 'id', description: '주문 ID', type: Number })
  @ApiResponse({ status: 200, description: '주문 취소 처리 성공', type: OrderResponseDto })
  @ApiResponse({ status: 400, description: '취소할 수 없는 주문 상태', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '주문을 찾을 수 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async cancelOrder(@Param('id') id: number): Promise<OrderResponseDto> {
    const order = await this.ordersService.cancelOrder(id);
    return new OrderResponseDto({ ...order, product: order.product });
  }
}