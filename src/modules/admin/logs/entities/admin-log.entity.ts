// src/modules/admin/logs/entities/admin-log.entity.ts
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AdminLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  adminId: number;

  @Column()
  ipAddress: string;

  @Column()
  userAgent: string;

  @Column()
  action: string;

  @CreateDateColumn()
  loggedAt: Date;
}
