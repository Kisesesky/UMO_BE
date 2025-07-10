// src/modules/weather/dto/weather-query.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class WeatherQueryDto {
  @ApiProperty({ description: '위도', example: 35.179982, required: false })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  @Type(() => Number)
  lat?: number;

  @ApiProperty({ description: '경도', example: 129.074017, required: false })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  @Type(() => Number)
  lon?: number;

  @ApiProperty({ description: '조회 타입 (current | weekly)', required: false, example: 'current' })
  @IsOptional()
  type?: 'current' | 'weekly';
}
