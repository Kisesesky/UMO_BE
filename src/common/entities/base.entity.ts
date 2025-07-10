// src/common/entities/base.entity.ts
import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // 스웨거 문서화를 위해 추가

export abstract class BaseEntity { // abstract로 선언하여 직접 인스턴스화되지 않도록 함
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
