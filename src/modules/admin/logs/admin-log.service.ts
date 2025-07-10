// src/modules/admin/logs/admin-log.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
  }: {
    adminId: number;
    action: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AdminLog> {
    const log = this.adminLogRepository.create({
      adminId,
      ipAddress: ipAddress ?? '',
      userAgent: userAgent ?? '',
      action,
    });
    return this.adminLogRepository.save(log);
  }

  async findLogsByAdminId(adminId: number): Promise<AdminLogResponseDto[]> {
    const logs = await this.adminLogRepository.find({ where: { adminId } });
    return logs.map(log => new AdminLogResponseDto(log));
  }
}
