// src/modules/admin/stat/admin-stats.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminStatsService } from './admin-stats.service';
import { AdminStatsSummaryDto } from './dto/admin-stats-response.dto';
import { AdminActionTrendDto } from './dto/admin-action-trend.dto';

@ApiTags('admin-stats')
@Controller('admin/stats')
export class AdminStatsController {
  constructor(private readonly statsService: AdminStatsService) {}

  @Get('summary')
  @ApiOperation({ summary: '관리자 통계 요약', description: '전체/활성/비활성 관리자 수, 오늘의 로그 수 등' })
  @ApiResponse({ status: 200, description: '통계 요약', type: AdminStatsSummaryDto })
  async getSummary() {
    const stats = await this.statsService.getSummary();
    return new AdminStatsSummaryDto(stats);
  }

  @Get('actions/daily')
  @ApiOperation({ summary: '일별 액션 트렌드', description: '최근 일주일간 관리자 액션 트렌드' })
  @ApiResponse({ status: 200, type: [AdminActionTrendDto] })
  async getDailyTrends() {
    return this.statsService.getDailyActionTrends();
  }

  @Get('top')
  @ApiOperation({ summary: '활동 많은 관리자 TOP5', description: '관리자별 액션 로그 랭킹' })
  @ApiResponse({ status: 200, description: '랭킹', type: Object })
  async getTopAdmins() {
    return this.statsService.getTopAdmins();
  }
}
