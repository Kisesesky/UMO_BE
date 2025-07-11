// src/modules/weather/weather.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WeatherService } from './services/weather.service';
import { WeatherController } from './weather.controller';
import { WeatherConfigModule } from 'src/config/weather/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyWeatherForecast } from './entities/daily-weather-forecast.entity';
import { WeatherScheduler } from './weather.scheduler';
import { MidtermForecastService } from './services/midterm-forecast.service';
import { CurrentWeatherService } from './services/current-weather.service';
import { RegionService } from './region/region.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyWeatherForecast]),
    HttpModule,
    WeatherConfigModule,
  ],
  controllers: [WeatherController],
  providers: [WeatherService, WeatherScheduler, MidtermForecastService, CurrentWeatherService, RegionService],
  exports: [WeatherService],
})
export class WeatherModule {}