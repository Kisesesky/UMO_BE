// src/users/users.controller.ts
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { USER_ROLE } from 'src/common/constants/user-role';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserChangeStatusDto } from './dto/change-status.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE.ADMIN) // 관리자만 모든 사용자 조회 가능
  @ApiOperation({ summary: '모든 사용자 조회', description: '시스템에 등록된 모든 사용자 정보를 조회합니다. (관리자 권한 필요)' })
  @ApiResponse({ status: 200, description: '성공적으로 모든 사용자 정보를 반환합니다.', type: [UserResponseDto] })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: string,
  ): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll({ page, limit, status });
    return users.map(user => new UserResponseDto(user));
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '특정 사용자 조회', description: 'ID를 통해 특정 사용자 정보를 조회합니다.' })
  @ApiParam({ name: 'id', description: '사용자 ID', type: Number })
  @ApiResponse({ status: 200, description: '성공적으로 사용자 정보를 반환합니다.', type: UserResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    const user = await this.usersService.findUserById(id);
    return new UserResponseDto(user);
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE.ADMIN) // 관리자만 사용자 생성 가능
  @ApiOperation({ summary: '사용자 등록', description: '새로운 사용자를 시스템에 등록합니다. (관리자 권한 필요)' })
  @ApiResponse({ status: 201, description: '사용자가 성공적으로 등록되었습니다.', type: UserResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터.', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 409, description: '이미 사용 중인 이메일입니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(createUserDto);
    return new UserResponseDto(user);
  }

  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '사용자 정보 수정', description: '특정 사용자의 정보를 수정합니다.' })
  @ApiParam({ name: 'id', description: '사용자 ID', type: Number })
  @ApiResponse({ status: 200, description: '사용자 정보가 성공적으로 수정되었습니다.', type: UserResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update(id, updateUserDto);
    return new UserResponseDto(user);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE.ADMIN) // 관리자만 사용자 삭제 가능
  @ApiOperation({ summary: '사용자 삭제', description: '특정 사용자를 시스템에서 삭제합니다. (관리자 권한 필요)' })
  @ApiParam({ name: 'id', description: '사용자 ID', type: Number })
  @ApiResponse({ status: 200, description: '사용자가 성공적으로 삭제되었습니다.' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.usersService.remove(id);
    return { message: '사용자가 성공적으로 삭제되었습니다.' };
  }

  @Put(':id/status')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE.ADMIN) // 관리자만 사용자 상태 변경 가능
  @ApiOperation({ summary: '사용자 상태 변경', description: '특정 사용자의 상태를 변경합니다. (관리자 권한 필요)' })
  @ApiParam({ name: 'id', description: '사용자 ID', type: Number })
  @ApiResponse({ status: 200, description: '사용자 상태가 성공적으로 변경되었습니다.', type: UserResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 상태 변경 요청.', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() userChangeStatusDto: UserChangeStatusDto
  ): Promise<UserResponseDto> {
    const user = await this.usersService.userChangeStatus(id, userChangeStatusDto.status);
    return new UserResponseDto(user);
  }
}