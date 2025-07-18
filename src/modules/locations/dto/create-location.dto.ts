// src/modules/locations/dto/create-location.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLocationDto {
  @ApiProperty({ description: '위도', example: 37.5665 })
  @IsNumber() @Min(-90) @Max(90)
  @Type(() => Number)
  latitude: number;

  @ApiProperty({ description: '경도', example: 126.9780 })
  @IsNumber() @Min(-180) @Max(180)
  @Type(() => Number)
  longitude: number;
}
