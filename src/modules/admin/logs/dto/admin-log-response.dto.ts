// src/modules/admin/logs/dto/admin-log-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { AdminLog } from '../entities/admin-log.entity';

export class AdminLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  adminId: number;

  @ApiProperty()
  ipAddress: string;

  @ApiProperty()
  userAgent: string;

  @ApiProperty()
  action: string;
  
  @ApiProperty() 
  loggedAt: Date;

  constructor(entity: AdminLog) {
    this.id = entity.id;
    this.adminId = entity.adminId;
    this.ipAddress = entity.ipAddress;
    this.userAgent = entity.userAgent;
    this.action = entity.action;
    this.loggedAt = entity.loggedAt;
  }
}
