// src/modules/admin/notifications/entities/notification.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

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
