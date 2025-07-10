// src/modules/weather/dto/current-weather-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { BaseWeatherResponseDto  } from '../../../common/dto/base-weather-response.dto';

export class CurrentWeatherResponseDto extends BaseWeatherResponseDto  {
  constructor(entity?: any) {
    super(entity || {})
  }
  @ApiProperty({ description: '날씨 상태', example: '맑음' })
  weatherCondition: string;

  @ApiProperty({ description: '강수 확률 (%)', example: 20 })
  precipitationProb: number;

  @ApiProperty({ description: '위치 정보', example: '부산 중구' })
  location: string;

  @ApiProperty({ description: '측정 시간', example: '2025-07-01 15:00:00' })
  observedAt: string;
}
