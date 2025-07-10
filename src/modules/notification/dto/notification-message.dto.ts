// src/modules/notification/dto/notification-message.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsDate, IsObject } from 'class-validator';
import { NotificationStatus, NOTIFICATION_STATUS, NOTIFICATION_STATUS_VALUES } from "src/common/constants/notification-status";

export class NotificationMessageDto {
  @ApiProperty({ example: 'f1a2b3c4-d5e6-7890-1234-56789abcdef0', description: '알림 UUID' })
  @IsString()
  id: string;

  @ApiProperty({ example: NOTIFICATION_STATUS.WEATHER, enum: NOTIFICATION_STATUS_VALUES, description: '알림 타입' })
  @IsString()
  // @IsEnum(NOTIFICATION_STATUS) // enum object가 아니라 values 배열로 체크
  @IsOptional() // 만약 생성 시 필수가 아니라면
  type: NotificationStatus;

  @ApiProperty({ example: '오늘의 날씨 알림', description: '알림 제목' })
  @IsString()
  title: string;

  @ApiProperty({ example: '오늘은 비가 오니 우산을 챙기세요!', description: '알림 메시지' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ example: 'https://example.com/weather.png', description: '알림 이미지 URL' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: '2025-07-09T12:34:56.789Z', description: '알림 생성 시각(ISO8601)' })
  @IsDate()
  createdAt: Date;

  @ApiPropertyOptional({ example: { rain: true, temp: 24 }, description: '추가 데이터(날씨 정보 등)' })
  @IsOptional()
  @IsObject()
  data?: any;
}
