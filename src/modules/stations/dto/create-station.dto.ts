// src/stations/dto/create-station.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateStationDto {
  @ApiProperty({ example: '강남역 대여소', description: '대여소 이름' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '서울특별시 강남구 강남대로 396', description: '대여소 주소' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: 37.498095, description: '위도' })
  @IsNotEmpty()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ example: 127.027610, description: '경도' })
  @IsNotEmpty()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiProperty({ example: '강남역 10번 출구 앞', description: '대여소 설명', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
