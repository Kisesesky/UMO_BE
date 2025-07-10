// src/modules/weather/mappers/weather.mapper.ts
import { CurrentWeatherResponseDto } from '../dto/current-weather-response.dto';
import { WeatherDataDto } from '../dto/weather-data.dto';
import { getWeatherConditionByRainType } from '../utils/weather-condition.util';

export class WeatherMapper {
  static toCurrentWeatherResponse(dto: WeatherDataDto): CurrentWeatherResponseDto {
    const response = new CurrentWeatherResponseDto();
    response.id = 0;
    response.createdAt = new Date();
    response.updatedAt = new Date();
    response.temperature = dto.temperature;
    response.humidity = dto.humidity;
    response.weatherCondition = getWeatherConditionByRainType(dto.rainType);
    response.precipitationProb = 0;
    response.windSpeed = dto.windSpeed;
    response.location = '현재 위치';
    response.observedAt = `${dto.baseDate.slice(0, 4)}-${dto.baseDate.slice(4, 6)}-${dto.baseDate.slice(6, 8)} ${dto.baseTime.slice(0, 2)}:${dto.baseTime.slice(2)}:00`;
    return response;
  }
}
