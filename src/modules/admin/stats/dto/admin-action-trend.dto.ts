// src/modules/admin/stats/dto/admin-action-trend.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class AdminActionTrendDto {
  @ApiProperty({ example: '2025-07-10', description: '날짜' })
  date: string;

  @ApiProperty({ example: 12, description: '액션 횟수' })
  count: number;

  constructor(date: string, count: number) {
    this.date = date;
    this.count = count;
  }
}
