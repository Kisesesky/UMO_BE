// src/modules/admin/admin.modules.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/app/config.module';
import { AppConfigService } from 'src/config/app/config.service';
import { RedisModule } from '../redis/redis.module';
import { AdminController } from './admin.controller';
import { Admin } from './entities/admin.entity';
import { AdminRolesGuard } from './guards/admin-role.guard';
import { AdminLogService } from './logs/admin-log.service';
import { AdminLog } from './logs/entities/admin-log.entity';
import { AdminService } from './services/admin.service';
import { LoginAttemptService } from './services/login-attempt.service';
import { AdminStatsController } from './stats/admin-stats.controller';
import { AdminStatsService } from './stats/admin-stats.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, AdminLog]),
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => ({
        secret: appConfigService.adminJwtSecret,
        signOptions: { expiresIn: appConfigService.adminAccessExpiresIn },
      }),
    }),
    RedisModule,
    AppConfigModule,
  ],
  controllers: [AdminController, AdminStatsController],
  providers: [AdminService, AdminRolesGuard, AdminLogService, AdminStatsService, LoginAttemptService],
  exports: [AdminService,LoginAttemptService],
})
export class AdminModule {}
