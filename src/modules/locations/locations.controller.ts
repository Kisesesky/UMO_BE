// src/modules/locations/locations.controller.ts
import { Controller, Post, Get, Body, UseGuards, Query, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationResponseDto } from './dto/location-response.dto';
import { RequestUser } from 'src/common/decorators/request-user.decorator';
import { User } from '../users/entities/user.entity';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('location')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('location')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '위치 이력 기록', description: '사용자의 위치를 이력으로 저장합니다.' })
  @ApiResponse({ status: 201, description: '위치 저장 성공', type: LocationResponseDto })
  @ApiResponse({ status: 401, description: '인증 필요', type: ErrorResponseDto })
  async create(
    @RequestUser() user: User,
    @Body() dto: CreateLocationDto,
  ): Promise<LocationResponseDto> {
    const location = await this.locationsService.createLocation(user, dto);
    return new LocationResponseDto(location); // DTO로 감싸서 반환
  }

  @Get('/latest')
  @ApiOperation({ summary: '가장 최근 위치 조회', description: '유저의 최신 위치를 조회합니다.' })
  @ApiResponse({ status: 200, description: '최근 위치 반환', type: LocationResponseDto })
  @ApiResponse({ status: 404, description: '위치 이력이 없음', type: ErrorResponseDto })
  async latest(
    @RequestUser() user: User
  ): Promise<LocationResponseDto> {
    const location = await this.locationsService.getLatestLocation(user.id);
    if (!location) throw new NotFoundException('위치 이력이 없습니다.');
    return new LocationResponseDto(location);
  }

  @Get()
  @ApiOperation({ summary: '위치 이력 조회', description: '최신순 위치 이력 리스트 반환 (기본 20개)' })
  @ApiResponse({ status: 200, description: '위치 이력 반환', type: [LocationResponseDto] })
  async locations(
    @RequestUser() user: User,
    @Query('limit') limit = 20,
  ): Promise<LocationResponseDto[]> {
    const locations = await this.locationsService.getLocations(user.id, Number(limit));
    return locations.map(loc => new LocationResponseDto(loc));
  }
}
