// src/common/dto/base-weather-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from './base-response.dto';

export abstract class BaseWeatherResponseDto extends BaseResponseDto {
  @ApiProperty({ description: '기온 (℃)', example: 25.3 })
  temperature: number;

  @ApiProperty({ description: '습도 (%)', example: 80 })
  humidity: number;

  @ApiProperty({ description: '시간당 강수량 (mm)', example: 0 })
  rainAmount?: number;

  @ApiProperty({ description: '풍속 (m/s)', example: 2.5 })
  windSpeed: number;

  @ApiProperty({ description: '풍향 (도)', example: 270 })
  windDirection?: number;
}
