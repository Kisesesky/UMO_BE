// src/modules/admin/notifications/notification.controller.ts
import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { NotificationResponseDto } from './dto/notification-response.dto';

@ApiTags('admin-notifications')
@ApiBearerAuth('JWT-auth')
@Controller('admin/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiOperation({ summary: '알림 전송', description: '관리자가 특정 사용자에게 알림을 전송합니다.' })
  @ApiResponse({ status: 201, description: '알림 전송 성공', type: Object })
  async send(@Body() dto: { userId: number; type: string; message: string }) {
    await this.notificationService.sendNotification(dto.userId, dto.type, dto.message);
    return { message: '알림이 전송되었습니다.' };
  }

  @Get(':userId')
  @ApiOperation({ summary: '사용자 알림 목록 조회', description: '특정 사용자의 알림 목록을 조회합니다.' })
  @ApiParam({ name: 'userId', description: '사용자 ID', type: Number })
  @ApiQuery({ name: 'page', required: false, description: '페이지 번호', type: Number })
  @ApiQuery({ name: 'type', required: false, description: '알림 타입', type: String })
  @ApiResponse({ status: 200, description: '알림 목록', type: [NotificationResponseDto] })
  async getUserNotifications(
    @Param('userId') userId: number,
    @Query('page') page?: number,
    @Query('type') type?: string,
  ) {
    return this.notificationService.getUserNotifications(userId, page, 20, type);
  }

  @Patch(':userId/read-all')
  @ApiOperation({ summary: '모든 알림 읽음 처리', description: '특정 사용자의 모든 알림을 읽음 처리합니다.' })
  @ApiParam({ name: 'userId', description: '사용자 ID', type: Number })
  @ApiResponse({ status: 200, description: '모든 알림 읽음 처리 완료', type: Object })
  async markAllAsRead(@Param('userId') userId: number) {
    await this.notificationService.markAllAsRead(userId);
    return { message: '모든 알림이 읽음 처리되었습니다.' };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: '알림 읽음 처리', description: '특정 알림을 읽음 처리합니다.' })
  @ApiParam({ name: 'id', description: '알림 ID', type: Number })
  @ApiResponse({ status: 200, description: '알림 읽음 처리 완료', type: Object })
  async markAsRead(@Param('id') id: number) {
    await this.notificationService.markAsRead(id);
    return { message: '알림이 읽음 처리되었습니다.' };
  }
}
