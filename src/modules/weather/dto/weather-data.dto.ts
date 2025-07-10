import { ApiProperty } from '@nestjs/swagger';
import { BaseWeatherResponseDto } from '../../../common/dto/base-weather-response.dto';

export class WeatherDataDto extends BaseWeatherResponseDto {
  constructor(entity?: any) {
    super(entity || {});
  }

  @ApiProperty({ description: '발표 일자', example: '20250701' })
  baseDate: string;

  @ApiProperty({ description: '발표 시각', example: '0600' })
  baseTime: string;

  @ApiProperty({ description: '예보 일자', example: '20250701' })
  fcstDate?: string;

  @ApiProperty({ description: '예보 시각', example: '1300' })
  fcstTime?: string;

  @ApiProperty({ description: '강수 형태 (0: 없음, 1: 비, 2: 비/눈, 3: 눈, 4: 소나기)', example: 0 })
  rainType: number;

  @ApiProperty({ description: '하늘 상태 (1: 맑음, 3: 구름 많음, 4: 흐림)', example: 1 })
  skyStatus?: number;

  @ApiProperty({ description: '낙뢰 여부 (0: 없음, 1: 있음)', example: 0 })
  lightning?: number;
}
