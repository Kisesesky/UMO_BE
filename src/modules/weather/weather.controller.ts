// src/modules/weather/weather.controller.ts
import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WeatherService } from './services/weather.service';
import { WeatherQueryDto } from './dto/weather-query.dto';
import { CurrentWeatherResponseDto } from './dto/current-weather-response.dto';
import { MidtermForecastDto } from './dto/midterm-forecast.dto';
import { ValidationPipe } from '@nestjs/common';

@ApiTags('weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('current')
  @ApiOperation({ summary: '현재 날씨 조회' })
  @ApiResponse({ status: 200, type: CurrentWeatherResponseDto })
  async getCurrentWeather(@Query(new ValidationPipe({ whitelist: true })) query: WeatherQueryDto): Promise<CurrentWeatherResponseDto> {
    if (query.lat === undefined || query.lon === undefined) {
      throw new BadRequestException('위도(lat)와 경도(lon) 필수값입니다.');
    }
    const weatherData = await this.weatherService.getCurrentWeather(query.lat, query.lon);

    // 필요한 필드를 CurrentWeatherResponseDto에 맞게 매핑
    const currentWeatherResponse = new CurrentWeatherResponseDto(weatherData);

    return currentWeatherResponse;
  }

  @Get('midterm')
  @ApiOperation({ summary: '중기예보 조회' })
  @ApiResponse({ status: 200, type: MidtermForecastDto })
  async getMidtermForecast(@Query(new ValidationPipe({ whitelist: true })) query: WeatherQueryDto): Promise<MidtermForecastDto> {
    if (query.lat === undefined || query.lon === undefined) {
      throw new BadRequestException('위도(lat)와 경도(lon) 필수값입니다.');
    }
    return this.weatherService.getMidtermForecast(query.lat, query.lon);
  }
}
