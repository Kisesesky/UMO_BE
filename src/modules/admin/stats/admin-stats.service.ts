// src/modules/admin/stats/admin-stats.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Admin } from '../entities/admin.entity';
import { AdminLog } from '../logs/entities/admin-log.entity';
import { subDays, format, startOfDay } from 'date-fns';
import { AdminActionTrendDto } from './dto/admin-action-trend.dto';

@Injectable()
export class AdminStatsService {
  constructor(
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
    @InjectRepository(AdminLog) private readonly adminLogRepo: Repository<AdminLog>,
  ) {}

  async getSummary() {
    const total = await this.adminRepo.count();
    const active = await this.adminRepo.count({ where: { isActive: true } });
    const suspended = await this.adminRepo.count({ where: { isActive: false } });
    const logsToday = await this.adminLogRepo.count({
      where: { loggedAt: MoreThan(startOfDay(new Date())) },
    });
    return { total, active, suspended, logsToday };
  }

  async getDailyActionTrends(days = 7): Promise<AdminActionTrendDto[]> {
    const today = startOfDay(new Date());
    const start = subDays(today, 6);
  
    const logs = await this.adminLogRepo
      .createQueryBuilder('log')
      .select("DATE(log.loggedAt)", "date")
      .addSelect("COUNT(*)", "count")
      .where("log.loggedAt BETWEEN :start AND :end", { start, end: today })
      .groupBy("date")
      .orderBy("date", "ASC")
      .getRawMany();
  
    return logs.map(l => new AdminActionTrendDto(format(new Date(l.date), 'yyyy-MM-dd'), Number(l.count)));
  }
  
  async getTopAdmins(limit = 5) {
    return this.adminLogRepo
      .createQueryBuilder('log')
      .select('log.adminId', 'adminId')
      .addSelect('COUNT(*)', 'count')
      .groupBy('log.adminId')
      .orderBy('count', 'DESC')
      .limit(limit)
      .getRawMany();
  }
}
