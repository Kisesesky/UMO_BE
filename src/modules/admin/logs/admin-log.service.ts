// src/modules/admin/logs/admin-log.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminLogAction } from 'src/common/constants/admin-log-action-status';
import { Repository } from 'typeorm';
import { AdminLogResponseDto } from './dto/admin-log-response.dto';
import { AdminLog } from './entities/admin-log.entity';

@Injectable()
export class AdminLogService {
  constructor(
    @InjectRepository(AdminLog)
    private readonly adminLogRepository: Repository<AdminLog>,
  ) {}

  async logAction({
    adminId,
    action,
    ipAddress,
    userAgent,
    meta = {},
  }: {
    adminId: number,
    action: AdminLogAction,
    ipAddress: string,
    userAgent: string,
    meta?: any,
  }) {
    await this.adminLogRepository.save({
      adminId,
      action,
      ipAddress,
      userAgent,
      meta: JSON.stringify(meta),
      createdAt: new Date(),
    });
  }

  async findLogsByAdminId(adminId: number): Promise<AdminLogResponseDto[]> {
    const logs = await this.adminLogRepository.find({ where: { adminId } });
    return logs.map(log => new AdminLogResponseDto(log));
  }
}
