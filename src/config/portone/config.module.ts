//src/config/portone/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { PortOneConfigService } from './config.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [configuration],
      validationSchema: Joi.object({
        PORTONE_CODE: Joi.string().required(),
        PORTONE_API_KEY: Joi.string().required(),
        PORTONE_API_SECRET: Joi.string().required(),
      }),
      isGlobal: true,
    }),
  ],
  providers: [ConfigService, PortOneConfigService],
  exports: [ConfigService, PortOneConfigService],
})
export class PortOneConfigModule {}
