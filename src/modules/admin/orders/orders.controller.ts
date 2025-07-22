// src/modules/admin/orders/admin-orders.controller.ts
import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { USER_ROLE } from 'src/common/constants/user-role';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { OrdersService } from 'src/modules/admin/orders/orders.service';
import { AdminRolesGuard } from '../guards/admin-role.guard';
import { UpdateOrderDto } from './dto/update-order.dto';

// 예시: '/admin/orders'
@Controller('admin/orders')
@UseGuards(JwtAuthGuard, AdminRolesGuard)
@Roles(USER_ROLE.ADMIN)
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // 모든 주문 목록
  @Get()
  async findAll() {
    return { data: await this.ordersService.findAll() };
  }

  // 단일 주문 조회
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return { data: await this.ordersService.findOne(+id) };
  }

  // 주문 정보 업데이트 (관리자만 가능) : 상태/주소 등
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return await this.ordersService.adminUpdate(+id, dto);
  }

  // 주문 완료 처리
  @Post(':id/complete')
  async complete(@Param('id') id: string) {
    return await this.ordersService.adminComplete(+id);
  }

  // 주문 취소 처리
  @Post(':id/cancel')
  async cancel(@Param('id') id: string) {
    return await this.ordersService.adminCancel(+id);
  }
}
