// src/modules/weather/processors/midterm-forecast.processor.ts
import { Injectable } from '@nestjs/common';
import { DailyWeatherForecast } from '../entities/daily-weather-forecast.entity';
import { WeatherResponseDto } from '../dto/weather-response.dto';
import { WeeklyWeatherResponseDto } from '../dto/weekly-weather-response.dto';

@Injectable()
export class MidtermForecastProcessor {
  /**
   * DailyWeatherForecast 엔티티 배열을 받아
   * 날짜별로 가공한 WeatherResponseDto 배열로 변환
   */
   toWeatherResponseDtos(forecasts: DailyWeatherForecast[]): WeatherResponseDto[] {
    return forecasts.map(forecast => {
      const dto = new WeatherResponseDto(forecast); // entity 전달
      dto.date = forecast.forecastDate.toISOString().slice(0, 10);
      dto.minTemperature = forecast.minTemperature;
      dto.maxTemperature = forecast.maxTemperature;
      dto.amWeatherCondition = forecast.amWeatherCondition || '알 수 없음';
      dto.pmWeatherCondition = forecast.pmWeatherCondition || '알 수 없음';
      dto.amPrecipitationProb = forecast.amPrecipitationProb || 0;
      dto.pmPrecipitationProb = forecast.pmPrecipitationProb || 0;
      dto.location = forecast.regId || '';
      return dto;
    });
  }
  

  /**
   * DailyWeatherForecast 배열을 받아서 WeeklyWeatherResponseDto 생성
   */
  toWeeklyWeatherResponseDto(location: string, forecasts: DailyWeatherForecast[]): WeeklyWeatherResponseDto {
    const weeklyDto = new WeeklyWeatherResponseDto();
    weeklyDto.location = location;
    weeklyDto.forecasts = this.toWeatherResponseDtos(forecasts);
    // id, createdAt, updatedAt은 필요 시 추가
    return weeklyDto;
  }
}
