// src/common/entities/base.entity.ts
import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntity {
  @ApiProperty({ example: 1, description: '고유 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '2023-10-26T09:55:00.000Z', description: '생성 시간' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2023-10-26T12:35:00.000Z', description: '마지막 업데이트 시간' })
  @UpdateDateColumn()
  updatedAt: Date;
}
