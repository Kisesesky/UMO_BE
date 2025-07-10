// src/common/entities/base-weather.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseWeatherEntity {
  @ApiProperty({ example: 1, description: '고유 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 60, description: '기상청 격자 X 좌표' })
  @Column({ type: 'int' })
  nx: number;

  @ApiProperty({ example: 127, description: '기상청 격자 Y 좌표' })
  @Column({ type: 'int' })
  ny: number;

  @ApiProperty({ example: '2025-07-10', description: '발표 일자 (YYYY-MM-DD)' })
  @Column({ type: 'date' })
  baseDate: Date;

  @ApiProperty({ example: '0600', description: '발표 시각 (HHmm)' })
  @Column({ type: 'varchar', length: 10 })
  baseTime: string;
}
