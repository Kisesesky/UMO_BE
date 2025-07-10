// src/modules/weather/dto/weather-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/dto/base-response.dto';

export class WeatherResponseDto extends BaseResponseDto {
  @ApiProperty({ description: '날짜', example: '2025-07-01' })
  date: string;

  @ApiProperty({ description: '최저 기온 (℃)', example: 22 })
  minTemperature: number;

  @ApiProperty({ description: '최고 기온 (℃)', example: 30 })
  maxTemperature: number;

  @ApiProperty({ description: '오전 날씨 상태', example: '맑음' })
  amWeatherCondition: string;

  @ApiProperty({ description: '오후 날씨 상태', example: '구름많음' })
  pmWeatherCondition: string;

  @ApiProperty({ description: '오전 강수 확률 (%)', example: 20 })
  amPrecipitationProb: number;

  @ApiProperty({ description: '오후 강수 확률 (%)', example: 60 })
  pmPrecipitationProb: number;

  @ApiProperty({ description: '위치 정보', example: '부산 중구' })
  location?: string;
}
