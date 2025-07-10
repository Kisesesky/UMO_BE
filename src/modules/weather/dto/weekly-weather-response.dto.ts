// src/modules/weather/dto/weekly-weather-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/dto/base-response.dto';
import { WeatherResponseDto } from './weather-response.dto';

export class WeeklyWeatherResponseDto extends BaseResponseDto {
  constructor(entity?: any) {
    super(entity || {});
  }
  @ApiProperty({ description: '위치 정보', example: '부산 중구' })
  location: string;

  @ApiProperty({ description: '주간 날씨 예보', type: [WeatherResponseDto] })
  forecasts: WeatherResponseDto[];
}
