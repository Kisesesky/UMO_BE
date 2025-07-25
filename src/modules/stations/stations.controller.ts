// src/stations/stations.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, Query, ParseFloatPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { StationsService } from './stations.service';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { StationResponseDto } from './dto/station-response.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { UmbrellaResponseDto } from 'src/modules/umbrellas/dto/umbrella-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { USER_ROLE } from 'src/modules/users/constants/user-role';

@ApiTags('stations')
@Controller('stations')
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  @Get()
  @ApiOperation({ summary: '모든 대여소 조회', description: '시스템에 등록된 모든 대여소 정보를 조회합니다.' })
  @ApiResponse({ status: 200, description: '성공적으로 모든 대여소 정보를 반환합니다.', type: [StationResponseDto] })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async findAll(): Promise<StationResponseDto[]> {
    const stations = await this.stationsService.findAll();
    // 각 대여소의 우산 개수도 함께 반환 (선택 사항)
    const stationsWithCount = await Promise.all(stations.map(async station => {
      const umbrellaCount = await this.stationsService.getUmbrellaCount(station.id);
      return new StationResponseDto(station, umbrellaCount);
    }));
    return stationsWithCount;
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 대여소 조회', description: 'ID를 통해 특정 대여소 정보를 조회합니다.' })
  @ApiParam({ name: 'id', description: '대여소 ID', type: Number })
  @ApiResponse({ status: 200, description: '성공적으로 대여소 정보를 반환합니다.', type: StationResponseDto })
  @ApiResponse({ status: 404, description: '대여소를 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<StationResponseDto> {
    const station = await this.stationsService.findOne(id);
    const umbrellaCount = await this.stationsService.getUmbrellaCount(id);
    return new StationResponseDto(station, umbrellaCount);
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE.ADMIN) // 관리자만 대여소 등록 가능
  @ApiOperation({ summary: '대여소 등록', description: '새로운 대여소를 시스템에 등록합니다. (관리자 권한 필요)' })
  @ApiResponse({ status: 201, description: '대여소가 성공적으로 등록되었습니다.', type: StationResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터.', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 409, description: '이미 존재하는 대여소입니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async create(@Body() createStationDto: CreateStationDto): Promise<StationResponseDto> {
    const station = await this.stationsService.create(createStationDto);
    return new StationResponseDto(station);
  }

  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE.ADMIN) // 관리자만 대여소 정보 수정 가능
  @ApiOperation({ summary: '대여소 정보 수정', description: '특정 대여소의 정보를 수정합니다. (관리자 권한 필요)' })
  @ApiParam({ name: 'id', description: '대여소 ID', type: Number })
  @ApiResponse({ status: 200, description: '대여소 정보가 성공적으로 수정되었습니다.', type: StationResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '대여소를 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStationDto: UpdateStationDto
  ): Promise<StationResponseDto> {
    const station = await this.stationsService.update(id, updateStationDto);
    const umbrellaCount = await this.stationsService.getUmbrellaCount(id);
    return new StationResponseDto(station, umbrellaCount);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE.ADMIN) // 관리자만 대여소 삭제 가능
  @ApiOperation({ summary: '대여소 삭제', description: '특정 대여소를 시스템에서 삭제합니다. (관리자 권한 필요)' })
  @ApiParam({ name: 'id', description: '대여소 ID', type: Number })
  @ApiResponse({ status: 200, description: '대여소가 성공적으로 삭제되었습니다.' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '대여소를 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.stationsService.remove(id);
  }

  @Get(':id/umbrellas')
  @ApiOperation({ summary: '대여소별 우산 목록 조회', description: '특정 대여소에 있는 우산 목록을 조회합니다.' })
  @ApiParam({ name: 'id', description: '대여소 ID', type: Number })
  @ApiResponse({ status: 200, description: '성공적으로 우산 목록을 반환합니다.', type: [UmbrellaResponseDto] })
  @ApiResponse({ status: 404, description: '대여소를 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 400, description: '비활성화된 대여소입니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async getUmbrellasInStation(@Param('id', ParseIntPipe) id: number): Promise<UmbrellaResponseDto[]> {
    const umbrellas = await this.stationsService.getUmbrellasInStation(id);
    return umbrellas.map(umbrella => new UmbrellaResponseDto(umbrella));
  }

  @Get('nearest')
  @ApiOperation({ summary: '가장 가까운 대여소 찾기', description: '현재 위치에서 가장 가까운 활성화된 대여소를 찾습니다.' })
  @ApiQuery({ name: 'latitude', description: '현재 위도', type: Number })
  @ApiQuery({ name: 'longitude', description: '현재 경도', type: Number })
  @ApiResponse({ status: 200, description: '가장 가까운 대여소 정보를 반환합니다.', type: StationResponseDto })
  @ApiResponse({ status: 404, description: '활성화된 대여소를 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 좌표 값', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async findNearestStation(
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number
  ): Promise<StationResponseDto> {
    const station = await this.stationsService.findNearestStation(latitude, longitude);
    const umbrellaCount = await this.stationsService.getUmbrellaCount(station.id);
    return new StationResponseDto(station, umbrellaCount);
  }
}