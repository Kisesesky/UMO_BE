import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import * as Joi from 'joi';
import { WeatherConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        KMA_API_KEY: Joi.string().required(),
      }),
      isGlobal: true,
    }),
  ],
  providers: [ConfigService, WeatherConfigService],
  exports: [ConfigService, WeatherConfigService],
})
export class WeatherConfigModule {}
