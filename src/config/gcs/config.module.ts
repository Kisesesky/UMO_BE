//src/config/gcs/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import * as Joi from 'joi';
import { GcsConfigService } from './config.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [configuration],
      validationSchema: Joi.object({
        GCS_STORAGE_KEYFILE: Joi.string().required(),
        GCS_STORAGE_BUCKET: Joi.string().required(),
        GCS_STORAGE_PROJECT_ID: Joi.string().required(),
      }),
      isGlobal: true,
    }),
  ],
  providers: [ConfigService, GcsConfigService],
  exports: [ConfigService, GcsConfigService],
})
export class GcsConfigModule {}
