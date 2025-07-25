// src/modules/umbrellas/umbrellas.controller.ts
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UmbrellaStatus, UMBRELLA_STATUS } from './constants/umbrella-status';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { UMBRELLA_STATUS_VALUES } from './constants/umbrella-status';
import { CreateUmbrellaDto } from './dto/create-umbrella.dto';
import { UmbrellaResponseDto } from './dto/umbrella-response.dto';
import { UpdateUmbrellaDto } from './dto/update-umbrella.dto';
import { UmbrellasService } from './umbrellas.service';
import { UmbrellaChangeStatusDto } from './dto/change-status.dto';
import { MoveStationDto } from './dto/move-station.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { USER_ROLE } from 'src/modules/users/constants/user-role';

@ApiTags('umbrellas')
@Controller('umbrellas')
export class UmbrellasController {
  constructor(private readonly umbrellasService: UmbrellasService) {}

  @Get()
  @ApiOperation({ summary: '모든 우산 조회', description: '시스템에 등록된 모든 우산 정보를 조회합니다.' })
  @ApiResponse({ status: 200, description: '성공적으로 모든 우산 정보를 반환합니다.', type: [UmbrellaResponseDto] })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async findAll(): Promise<UmbrellaResponseDto[]> {
    const umbrellas = await this.umbrellasService.findAll();
    return umbrellas.map(umbrella => new UmbrellaResponseDto(umbrella));
  }

  @Get('available')
  @ApiOperation({ summary: '대여 가능한 우산 조회', description: '현재 대여 가능한 상태의 우산 정보를 조회합니다.' })
  @ApiResponse({ status: 200, description: '성공적으로 대여 가능한 우산 정보를 반환합니다.', type: [UmbrellaResponseDto] })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async findAvailable(): Promise<UmbrellaResponseDto[]> {
    const umbrellas = await this.umbrellasService.findAvailable();
    return umbrellas.map(umbrella => new UmbrellaResponseDto(umbrella));
  }

  @Get('station/:stationId')
  @ApiOperation({ summary: '대여소별 우산 조회', description: '특정 대여소에 있는 대여 가능한 우산 정보를 조회합니다.' })
  @ApiParam({ name: 'stationId', description: '대여소 ID', type: Number })
  @ApiQuery({ 
    name: 'status', 
    description: '우산 상태 필터 (선택 사항)', 
    required: false, 
    enum: UMBRELLA_STATUS_VALUES // enum 추가 - 이제 Swagger UI에서 드롭다운으로 선택 가능
  })
  @ApiResponse({ status: 200, description: '성공적으로 대여소별 우산 정보를 반환합니다.', type: [UmbrellaResponseDto] })
  @ApiResponse({ status: 404, description: '대여소를 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async findByStation(
    @Param('stationId', ParseIntPipe) stationId: number,
    @Query('status') status?: UmbrellaStatus
  ): Promise<UmbrellaResponseDto[]> {
    const umbrellas = await this.umbrellasService.findByStation(stationId, status);
    return umbrellas.map(umbrella => new UmbrellaResponseDto(umbrella));
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 우산 조회', description: 'ID를 통해 특정 우산 정보를 조회합니다.' })
  @ApiParam({ name: 'id', description: '우산 ID', type: Number })
  @ApiResponse({ status: 200, description: '성공적으로 우산 정보를 반환합니다.', type: UmbrellaResponseDto })
  @ApiResponse({ status: 404, description: '우산을 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UmbrellaResponseDto> {
    const umbrella = await this.umbrellasService.findOne(id);
    return new UmbrellaResponseDto(umbrella);
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE.ADMIN) // 관리자만 우산 등록 가능
  @ApiOperation({ summary: '우산 등록', description: '새로운 우산을 시스템에 등록합니다. (관리자 권한 필요)' })
  @ApiResponse({ status: 201, description: '우산이 성공적으로 등록되었습니다.', type: UmbrellaResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터.', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async create(@Body() createUmbrellaDto: CreateUmbrellaDto): Promise<UmbrellaResponseDto> {
    const umbrella = await this.umbrellasService.create(createUmbrellaDto);
    return new UmbrellaResponseDto(umbrella);
  }

  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE.ADMIN) // 관리자만 우산 정보 수정 가능
  @ApiOperation({ summary: '우산 정보 수정', description: '특정 우산의 정보를 수정합니다. (관리자 권한 필요)' })
  @ApiParam({ name: 'id', description: '우산 ID', type: Number })
  @ApiResponse({ status: 200, description: '우산 정보가 성공적으로 수정되었습니다.', type: UmbrellaResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '우산을 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUmbrellaDto: UpdateUmbrellaDto
  ): Promise<UmbrellaResponseDto> {
    const umbrella = await this.umbrellasService.update(id, updateUmbrellaDto);
    return new UmbrellaResponseDto(umbrella);
  }

  @Put(':id/status')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE.ADMIN) // 관리자만 우산 상태 변경 가능
  @ApiOperation({ summary: '우산 상태 변경', description: '특정 우산의 상태를 변경합니다. (관리자 권한 필요)' })
  @ApiParam({ name: 'id', description: '우산 ID', type: Number })
  @ApiResponse({ status: 200, description: '우산 상태가 성공적으로 변경되었습니다.', type: UmbrellaResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 상태 변경 요청.', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '우산을 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() umbrellaChangeStatus: UmbrellaChangeStatusDto,
  ): Promise<UmbrellaResponseDto> {
    const umbrella = await this.umbrellasService.umbrellaChangeStatus(id, umbrellaChangeStatus.status);
    return new UmbrellaResponseDto(umbrella);
  }

  @Put(':id/lost')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE.ADMIN) // 관리자만 우산 분실 처리 가능
  @ApiOperation({ summary: '우산 분실 처리', description: '특정 우산을 분실 처리합니다. (관리자 권한 필요)' })
  @ApiParam({ name: 'id', description: '우산 ID', type: Number })
  @ApiResponse({ status: 200, description: '우산이 분실 처리되었습니다.', type: UmbrellaResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청.', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '우산을 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async markAsLost(@Param('id', ParseIntPipe) id: number): Promise<UmbrellaResponseDto> {
    const umbrella = await this.umbrellasService.markAsLost(id);
    return new UmbrellaResponseDto(umbrella);
  }

  @Put(':id/move')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE.ADMIN) // 관리자만 우산 이동 가능
  @ApiOperation({ summary: '우산 위치 이동', description: '특정 우산을 다른 대여소로 이동합니다. (관리자 권한 필요)' })
  @ApiParam({ name: 'id', description: '우산 ID', type: Number })
  @ApiResponse({ status: 200, description: '우산이 성공적으로 이동되었습니다.', type: UmbrellaResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청.', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '우산 또는 대여소를 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async moveToStation(
    @Param('id', ParseIntPipe) id: number,
    @Body() moveStationDto: MoveStationDto
  ): Promise<UmbrellaResponseDto> {
    const umbrella = await this.umbrellasService.moveToStation(id, moveStationDto.stationId);
    return new UmbrellaResponseDto(umbrella);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE.ADMIN) // 관리자만 우산 삭제 가능
  @ApiOperation({ summary: '우산 삭제', description: '특정 우산을 시스템에서 삭제합니다. (관리자 권한 필요)' })
  @ApiParam({ name: 'id', description: '우산 ID', type: Number })
  @ApiResponse({ status: 200, description: '우산이 성공적으로 삭제되었습니다.' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '우산을 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.umbrellasService.remove(id);
  }
}