// src/modules/admin/admin.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminRoles } from './decorators/admin-roles.decorator';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminService } from './services/admin.service';
import { AdminRolesGuard } from './guards/admin-role.guard';
import { ADMIN_ROLE } from '../../common/constants/admin-role';
import { AdminResponseDto } from './dto/admin-response.dto';
import { AdminLogService } from './logs/admin-log.service';
import { ChangePasswordDto } from './dto/change-password-admin.dto';
import { ResetPasswordDto } from './dto/reset-password-admin.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { AdminLoginDto } from './dto/login-admin.dto';
import { AdminAuthResponseDto } from './dto/admin-auth-response.dto';

@ApiTags('admin')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, AdminRolesGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly adminLogService: AdminLogService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: '내 프로필 조회', description: '접속한 관리자 자신의 프로필을 반환합니다.' })
  @ApiResponse({ status: 200, description: '본인 정보', type: AdminResponseDto })
  async getMe(@Req() req): Promise<AdminResponseDto> {
    // JWT payload의 sub가 보통 admin.id
    const adminId = req.user.sub;
    return this.adminService.getAdminById(adminId);
  }

  @AdminRoles(ADMIN_ROLE.SUPER_ADMIN)
  @Post()
  @ApiOperation({ summary: '관리자 생성', description: '새로운 관리자를 생성합니다.' })
  @ApiResponse({ status: 201, description: '관리자 생성 성공', type: AdminResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청', type: ErrorResponseDto })
  async createAdmin(
    @Body() createAdminDto: CreateAdminDto,
    @Req() request: Request,
  ): Promise<AdminResponseDto> {
    return this.adminService.createAdmin(createAdminDto, request);
  }

  @AdminRoles(ADMIN_ROLE.SUPER_ADMIN, ADMIN_ROLE.GENERAL_ADMIN)
  @Get()
  @ApiOperation({ summary: '관리자 목록 조회', description: '모든 관리자 목록을 조회합니다.' })
  @ApiResponse({ status: 200, description: '관리자 목록 반환', type: [AdminResponseDto] })
  async getAllAdmins(): Promise<AdminResponseDto[]> {
    return this.adminService.getAllAdmins();
  }

  @AdminRoles(ADMIN_ROLE.SUPER_ADMIN, ADMIN_ROLE.GENERAL_ADMIN)
  @Get(':id')
  @ApiOperation({ summary: '관리자 상세 조회', description: '특정 관리자의 상세 정보를 조회합니다.' })
  @ApiParam({ name: 'id', description: '관리자 ID', type: Number })
  @ApiResponse({ status: 200, description: '관리자 정보 반환', type: AdminResponseDto })
  @ApiResponse({ status: 404, description: '관리자를 찾을 수 없음', type: ErrorResponseDto })
  async getAdminById(@Param('id', ParseIntPipe) id: number): Promise<AdminResponseDto> {
    return this.adminService.getAdminById(id);
  }

  @AdminRoles(ADMIN_ROLE.SUPER_ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: '관리자 정보 수정', description: '특정 관리자의 정보를 수정합니다.' })
  @ApiParam({ name: 'id', description: '관리자 ID', type: Number })
  @ApiResponse({ status: 200, description: '수정된 관리자 정보 반환', type: AdminResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청', type: ErrorResponseDto })
  async updateAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
    @Req() request: Request,
  ): Promise<AdminResponseDto> {
    return this.adminService.updateAdmin(id, updateAdminDto, request);
  }

  @AdminRoles(ADMIN_ROLE.SUPER_ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: '관리자 삭제(비활성화)', description: '특정 관리자를 삭제(soft delete)합니다.' })
  @ApiParam({ name: 'id', description: '관리자 ID', type: Number })
  @ApiResponse({ status: 200, description: '관리자 삭제 완료', type: Object })
  @ApiResponse({ status: 404, description: '관리자를 찾을 수 없음', type: ErrorResponseDto })
  async softDeleteAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ message: string }> {
    return this.adminService.softDeleteAdmin(id, request);
  }

  @AdminRoles(ADMIN_ROLE.SUPER_ADMIN)
  @Get(':id/logs')
  @ApiOperation({ summary: '관리자 액션 로그 조회', description: '특정 관리자의 액션 로그를 조회합니다.' })
  @ApiParam({ name: 'id', description: '관리자 ID', type: Number })
  @ApiResponse({ status: 200, description: '관리자 로그 반환', type: Object })
  async getAdminLogs(@Param('id', ParseIntPipe) id: number) {
    return this.adminLogService.findLogsByAdminId(id);
  }

  @Patch(':id/password')
  @AdminRoles(ADMIN_ROLE.SUPER_ADMIN, ADMIN_ROLE.GENERAL_ADMIN)
  @ApiOperation({ summary: '비밀번호 변경', description: '관리자가 자신의 비밀번호를 변경합니다.' })
  @ApiParam({ name: 'id', description: '관리자 ID', type: Number })
  @ApiResponse({ status: 200, description: '비밀번호 변경 성공', type: Object })
  @ApiResponse({ status: 400, description: '잘못된 요청', type: ErrorResponseDto })
  async changeAdminPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangePasswordDto,
    @Req() request: Request,
  ): Promise<{ message: string }> {
    return this.adminService.changeAdminPassword(id, dto, request);
  }

  @Patch(':id/password/reset')
  @AdminRoles(ADMIN_ROLE.SUPER_ADMIN)
  @ApiOperation({ summary: '비밀번호 초기화', description: '슈퍼 관리자가 다른 관리자의 비밀번호를 초기화합니다.' })
  @ApiParam({ name: 'id', description: '관리자 ID', type: Number })
  @ApiResponse({ status: 200, description: '비밀번호 초기화 성공', type: Object })
  @ApiResponse({ status: 400, description: '잘못된 요청', type: ErrorResponseDto })
  async resetAdminPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ResetPasswordDto,
    @Req() request: Request,
  ): Promise<{ message: string }> {
    return this.adminService.resetAdminPassword(id, dto, request);
  }

  @Post('logout')
  @ApiOperation({ summary: '관리자 로그아웃', description: '관리자 로그아웃을 처리합니다.' })
  @ApiResponse({ status: 200, description: '로그아웃 성공', type: Object })
  async logAdminLogout(
    @Body('adminId') adminId: number,
    @Req() request: Request,
  ): Promise<{ message: string }> {
    return this.adminService.logAdminLogout(adminId, request);
  }

  @Post('login')
  @ApiOperation({ summary: '관리자 로그인', description: '관리자 로그인을 처리합니다.' })
  @ApiResponse({ status: 200, description: '로그인 성공', type: AdminAuthResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패', type: ErrorResponseDto })
  @ApiBody({ type: AdminLoginDto })
  async login(
    @Body() dto: AdminLoginDto,
    @Req() req,
  ): Promise<AdminAuthResponseDto> {
    const origin = req.headers.origin || '';
    return this.adminService.login(dto, origin);
  }
}
