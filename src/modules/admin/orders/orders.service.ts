// src/modules/orders/orders.service.ts

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';

// 예시용 임시 데이터
const orders = [
  { id: 1, status: 'pending', items: [], customer: '홍길동', total: 5000 },
  { id: 2, status: 'completed', items: [], customer: '김둘리', total: 15000 },
];

@Injectable()
export class OrdersService {
  // 관리자 주문 전체 조회
  findAll() {
    return orders;
  }

  // 관리자 주문 상세 조회
  findOne(id: number) {
    const order = orders.find((o) => o.id === id);
    if (!order)
      throw new NotFoundException(`주문 #${id}이(가) 존재하지 않습니다.`);
    return order;
  }

  // 관리자 주문 수정
  adminUpdate(id: number, updateOrderDto: UpdateOrderDto) {
    const order = orders.find((o) => o.id === id);
    if (!order)
      throw new NotFoundException(`주문 #${id}이(가) 존재하지 않습니다.`);

    Object.assign(order, updateOrderDto);
    return { message: '주문이 수정되었습니다.', order };
  }

  // 관리자 주문 완료 처리
  adminComplete(id: number) {
    const order = orders.find((o) => o.id === id);
    if (!order)
      throw new NotFoundException(`주문 #${id}이(가) 존재하지 않습니다.`);
    if (order.status === 'completed')
      throw new BadRequestException('이미 완료된 주문입니다.');

    order.status = 'completed';
    return { message: '주문이 완료처리되었습니다.', order };
  }

  // 관리자 주문 취소 처리
  adminCancel(id: number) {
    const order = orders.find((o) => o.id === id);
    if (!order)
      throw new NotFoundException(`주문 #${id}이(가) 존재하지 않습니다.`);
    if (order.status === 'canceled')
      throw new BadRequestException('이미 취소된 주문입니다.');

    order.status = 'canceled';
    return { message: '주문이 취소되었습니다.', order };
  }
}
