// src/stations/dto/station-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { Station } from '../entities/station.entity';

export class StationResponseDto extends BaseResponseDto {
  @ApiProperty({ example: '강남역 대여소', description: '대여소 이름' })
  name: string;

  @ApiProperty({ example: '서울특별시 강남구 강남대로 396', description: '대여소 주소' })
  address: string;

  @ApiProperty({ example: 37.498095, description: '위도' })
  latitude: number;

  @ApiProperty({ example: 127.027610, description: '경도' })
  longitude: number;

  @ApiProperty({ example: true, description: '활성화 여부' })
  isActive: boolean;

  @ApiProperty({ example: '강남역 10번 출구 앞', description: '대여소 설명', nullable: true })
  description: string;

  @ApiProperty({ example: 5, description: '현재 보유 중인 우산 수', required: false })
  umbrellaCount?: number;

  constructor(station: Station, umbrellaCount?: number) {
    super(station);
    this.name = station.name;
    this.address = station.address;
    this.latitude = station.latitude;
    this.longitude = station.longitude;
    this.isActive = station.isActive;
    this.description = station.description;
    
    if (umbrellaCount !== undefined) {
      this.umbrellaCount = umbrellaCount;
    }
  }
}
