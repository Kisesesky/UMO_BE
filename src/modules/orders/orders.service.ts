// src/modules/orders/orders.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ORDER_STATUS } from './constants/order-status';
import {
  OrderAlreadyProcessedException,
  OrderCannotCancelException, OrderNotFoundException, RealMoneyPaymentException, UnsupportedCurrencyException
} from './exceptions/order.exceptions';
import { CURRENCY_TYPE } from '../products/types/currency-types';
import { PRODUCT_TYPE } from '../products/types/product-types';
import { ProductsService } from '../products/products.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { WalletsService } from '../wallets/wallets.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly productsService: ProductsService,
    private readonly walletsService: WalletsService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['product'] });
  }

  async findByUserId(userId: number): Promise<Order[]> {
    return this.orderRepository.find({ 
      where: { userId },
      relations: ['product'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ 
      where: { id },
      relations: ['product']
    });
    if (!order) {
      throw new OrderNotFoundException(id);
    }
    return order;
  }

  async create(userId: number, createOrderDto: CreateOrderDto): Promise<Order> {
    // 상품 정보 조회
    const product = await this.productsService.findOne(createOrderDto.productId);
    
    // 결제 처리
    await this.processPayment(userId, product);
    
    // 주문 생성
    const order = this.orderRepository.create({
      userId,
      productId: product.id,
      status: ORDER_STATUS.PENDING,
      totalAmount: product.price,
    });
    
    const savedOrder = await this.orderRepository.save(order);
    
    // 주문 완료 처리
    return this.completeOrder(savedOrder.id);
  }

  async completeOrder(orderId: number): Promise<Order> {
    const order = await this.findOne(orderId);
    
    if (order.status !== ORDER_STATUS.PENDING) {
      throw new OrderAlreadyProcessedException(order.status);
    }
    
    // 상품 유형에 따른 후속 처리
    const product = order.product;
    
    if (product.productType === PRODUCT_TYPE.PASS) {
      // 이용권 생성
      await this.subscriptionsService.createFromOrder(order);
    }
    
    // 주문 상태 업데이트
    order.status = ORDER_STATUS.COMPLETED;
    order.completedAt = new Date();
    
    return this.orderRepository.save(order);
  }

  async cancelOrder(orderId: number): Promise<Order> {
    const order = await this.findOne(orderId);
    
    if (order.status !== ORDER_STATUS.PENDING) {
      throw new OrderCannotCancelException(order.status);
    }
    
    // 환불 처리
    await this.processRefund(order);
    
    // 주문 상태 업데이트
    order.status = ORDER_STATUS.CANCELED;
    
    return this.orderRepository.save(order);
  }

  private async processPayment(userId: number, product: any): Promise<void> {
    // 결제 화폐 유형에 따른 처리
    switch (product.currencyType) {
      case CURRENCY_TYPE.CHURU:
        // 츄르 차감
        await this.walletsService.withdrawChuru(userId, product.price);
        break;
      case CURRENCY_TYPE.CATNIP:
        // 캣닢 차감
        await this.walletsService.withdrawCatnip(userId, product.price);
        break;
      case CURRENCY_TYPE.REAL_MONEY:
        // 실제 결제는 PaymentsService에서 처리 (여기서는 생략)
        throw new RealMoneyPaymentException();
      default:
        throw new UnsupportedCurrencyException(product.currencyType);
    }
  }

  private async processRefund(order: Order): Promise<void> {
    // 결제 화폐 유형에 따른 환불 처리
    const product = order.product;
    
    switch (product.currencyType) {
      case CURRENCY_TYPE.CHURU:
        // 츄르 환불
        await this.walletsService.depositChuru(order.userId, product.price);
        break;
      case CURRENCY_TYPE.CATNIP:
        // 캣닢 환불
        await this.walletsService.addCatnip(order.userId, product.price);
        break;
      case CURRENCY_TYPE.REAL_MONEY:
        // 실제 환불은 별도 처리 (여기서는 생략)
        throw new RealMoneyPaymentException();
      default:
        throw new UnsupportedCurrencyException(product.currencyType);
    }
  }
}