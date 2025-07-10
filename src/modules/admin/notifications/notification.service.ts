// src/modules/admin/notifications/notification.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification) private readonly repo: Repository<Notification>,
  ) {}

  async sendNotification(userId: number, type: string, message: string) {
    const notification = this.repo.create({ userId, type, message });
    await this.repo.save(notification);
  }

  async markAsRead(id: number) {
    await this.repo.update(id, { isRead: true });
  }

  async getUserNotifications(userId: number, page = 1, pageSize = 20, type?: string) {
    const qb = this.repo.createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);
  
    if (type) qb.andWhere('notification.type = :type', { type });
  
    const [items, total] = await qb.getManyAndCount();
    return { items: items.map(n => new NotificationResponseDto(n)), total };
  }
  
  async markAllAsRead(userId: number) {
    await this.repo.update({ userId, isRead: false }, { isRead: true });
  }
  
}
