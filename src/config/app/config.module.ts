//src/config/app/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { AppConfigService } from './config.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [configuration],
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        ACCESS_EXPIRES_IN: Joi.string().required(),
        JWT_REFRESH_EXPIRES_IN: Joi.string().required(),
        ADMIN_JWT_SECRET: Joi.string().required(),
        ADMIN_JWT_REFRESH_SECRET: Joi.string().required(),
        ADMIN_ACCESS_EXPIRES_IN: Joi.string().required(),
        ADMIN_JWT_REFRESH_EXPIRES_IN: Joi.string().required(),
        PORT: Joi.number().required(),
        FRONTEND_URL: Joi.string().required(),
        GMAIL_USER: Joi.string().required(),
        GMAIL_PASS: Joi.string().required(),
      }),
      isGlobal: true,
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
