// src/modules/admin/stats/dto/admin-stats-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class AdminStatsSummaryDto {
  @ApiProperty({ example: 10, description: '전체 관리자 수' })
  total: number;

  @ApiProperty({ example: 8, description: '활성 관리자 수' })
  active: number;

  @ApiProperty({ example: 2, description: '비활성 관리자 수' })
  suspended: number;

  @ApiProperty({ example: 5, description: '오늘의 액션 로그 수' })
  logsToday: number;

  constructor(data: { total: number; active: number; suspended: number; logsToday: number }) {
    this.total = data.total;
    this.active = data.active;
    this.suspended = data.suspended;
    this.logsToday = data.logsToday;
  }
}
