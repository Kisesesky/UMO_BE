// src/modules/weather/weather.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WeatherService } from './services/weather.service';
import { WeatherController } from './weather.controller';
import { WeatherConfigModule } from 'src/config/weather/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyWeatherForecast } from './entities/daily-weather-forecast.entity';
import { WeatherScheduler } from './weather.scheduler';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyWeatherForecast]),
    HttpModule,
    WeatherConfigModule,
  ],
  controllers: [WeatherController],
  providers: [WeatherService, WeatherScheduler],
  exports: [WeatherService],
})
export class WeatherModule {}