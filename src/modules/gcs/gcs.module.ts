// src/modules/gcs/gcs.module.ts
import { Module } from '@nestjs/common';
import { GcsService } from './gcs.service';
import { GcsConfigService } from 'src/config/gcs/config.service';
import { GcsServiceController } from './gcs.controller';
import { GcsConfigModule } from 'src/config/gcs/config.module';

@Module({
  imports: [GcsConfigModule],
  controllers: [GcsServiceController],
  providers: [GcsService, GcsConfigService],
  exports: [GcsService, GcsConfigService],
})
export class GcsModule {}
