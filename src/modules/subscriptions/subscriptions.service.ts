// src/modules/subscriptions/subscriptions.service.ts
import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { SUBSCRIPTION_STATUS } from '../../common/constants/subscription-status';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async findAll(): Promise<Subscription[]> {
    return this.subscriptionRepository.find({ relations: ['product'] });
  }

  async findByUserId(userId: number): Promise<Subscription[]> {
    return this.subscriptionRepository.find({
      where: { userId },
      relations: ['product'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['product']
    });
    if (!subscription) {
      throw new NotFoundException(`이용권 ID ${id}를 찾을 수 없습니다.`);
    }
    return subscription;
  }

  async createFromOrder(order: any): Promise<Subscription> {
    const product = order.product;
    
    // 이용권 시작일과 종료일 계산
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + product.durationDays);
    
    // 이용권 생성
    const subscription = this.subscriptionRepository.create({
      userId: order.userId,
      productId: product.id,
      startDate,
      endDate,
      status: SUBSCRIPTION_STATUS.ACTIVE,
    });
    
    return this.subscriptionRepository.save(subscription);
  }

  async findActiveSubscription(userId: number): Promise<Subscription | null> {
    const now = new Date();
    
    // 현재 활성화된 이용권 찾기
    const subscription = await this.subscriptionRepository.findOne({
      where: {
        userId,
        status: SUBSCRIPTION_STATUS.ACTIVE,
        startDate: LessThanOrEqual(now),
        endDate: MoreThanOrEqual(now),
      },
      relations: ['product'],
      order: { endDate: 'DESC' } // 만료일이 가장 늦은 이용권 선택
    });
    
    return subscription;
  }

  async hasActiveSubscription(userId: number): Promise<boolean> {
    const subscription = await this.findActiveSubscription(userId);
    return !!subscription;
  }

  async cancelSubscription(id: number): Promise<Subscription> {
    const subscription = await this.findOne(id);
    
    if (subscription.status !== SUBSCRIPTION_STATUS.ACTIVE) {
      throw new BadRequestException(`취소할 수 없는 이용권 상태입니다. 현재 상태: ${subscription.status}`);
    }
    
    subscription.status = SUBSCRIPTION_STATUS.CANCELED;
    return this.subscriptionRepository.save(subscription);
  }

  async expireSubscriptions(): Promise<number> {
    // 만료된 이용권 상태 업데이트 (스케줄러에서 호출)
    const now = new Date();
    
    const result = await this.subscriptionRepository.update(
      {
        status: SUBSCRIPTION_STATUS.ACTIVE,
        endDate: LessThanOrEqual(now),
      },
      {
        status: SUBSCRIPTION_STATUS.EXPIRED,
      }
    );
    
    return result.affected || 0;
  }
}