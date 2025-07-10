// src/modules/admin/notifications/dto/notification-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { Notification } from '../entities/notification.entity';

export class NotificationResponseDto extends BaseResponseDto {
  @ApiProperty({ description: '알림 수신자(유저) ID', example: 123 })
  userId: number;

  @ApiProperty({ description: '알림 타입', example: 'ACCOUNT_LOCKED' })
  type: string;

  @ApiProperty({ description: '알림 메시지', example: '계정이 잠겼습니다.' })
  message: string;

  @ApiProperty({ description: '읽음 여부', example: false })
  isRead: boolean;

  constructor(entity: Notification) {
    super(entity);
    this.userId = entity.userId;
    this.type = entity.type;
    this.message = entity.message;
    this.isRead = entity.isRead;
  }
}
