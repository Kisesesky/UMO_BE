// src/modules/admin/notifications/entities/notification.entity.ts
import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Notification extends BaseEntity {
  @Column() 
  userId: number;

  @Column() 
  type: string;

  @Column() 
  message: string;

  @Column({ default: false }) 
  isRead: boolean;
}
