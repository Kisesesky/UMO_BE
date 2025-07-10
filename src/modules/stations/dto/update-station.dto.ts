// src/stations/dto/update-station.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsBoolean, Min, Max } from 'class-validator';

export class UpdateStationDto {
  @ApiProperty({ example: '강남역 대여소', description: '대여소 이름', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '서울특별시 강남구 강남대로 396', description: '대여소 주소', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 37.498095, description: '위도', required: false })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiProperty({ example: 127.027610, description: '경도', required: false })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiProperty({ example: true, description: '활성화 여부', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: '강남역 10번 출구 앞', description: '대여소 설명', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
