// src/modules/weather/dto/weather-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/dto/base-response.dto';
import { WeatherDataDto } from './weather-data.dto';

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

  constructor(entity?: Partial<WeatherResponseDto>) {
    super(entity || {});
    this.date = entity?.date ?? '';
    this.minTemperature = entity?.minTemperature ?? 0;
    this.maxTemperature = entity?.maxTemperature ?? 0;
    this.amWeatherCondition = entity?.amWeatherCondition ?? '';
    this.pmWeatherCondition = entity?.pmWeatherCondition ?? '';
    this.amPrecipitationProb = entity?.amPrecipitationProb ?? 0;
    this.pmPrecipitationProb = entity?.pmPrecipitationProb ?? 0;
    this.location = entity?.location ?? '';
  }

  static fromWeatherDataDto(data: WeatherDataDto): WeatherResponseDto {
    return new WeatherResponseDto({
      date: data.baseDate ?? '',
      minTemperature: data.temperature ?? 0, // 단기예보라면 temperature를 min/max로 사용
      maxTemperature: data.temperature ?? 0,
      amWeatherCondition: '', // WeatherDataDto에 없으므로 기본값
      pmWeatherCondition: '', // WeatherDataDto에 없으므로 기본값
      amPrecipitationProb: 0, // WeatherDataDto에 없으므로 기본값
      pmPrecipitationProb: 0, // WeatherDataDto에 없으므로 기본값
      location: '',           // WeatherDataDto에 없으므로 기본값
      id: data.id,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
