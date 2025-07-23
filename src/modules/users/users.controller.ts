// src/users/users.controller.ts
import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
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
import { RequestUser } from 'src/common/decorators/request-user.decorator';
import { UserChangePasswordDto } from './dto/user-change-password.dto';
import { GcsService } from './../gcs/gcs.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly gcsService: GcsService,
  ) {}

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
  @ApiOperation({ summary: '사용자 등록(관리자)', description: '관리자가 신규 유저 등록' })
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

  @Patch('profile')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('profileImage', {
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new BadRequestException('이미지 파일만 올릴 수 있습니다.'), false);
      }
      cb(null, true);
    }
  }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '내 프로필 일부 수정', description: '이름 또는 프로필이미지(선택)만 일부 수정' })
  @ApiBody({
    description: '이름, 프로필 이미지',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: '홍길동' },
        profileImage: { type: 'string', format: 'binary' },
      },
      required: [],
    }
  })
  @ApiResponse({ status: 200, description: '프로필 변경 성공', type: UserResponseDto })
  async updateMyProfile(
    @RequestUser() user: UserResponseDto,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateProfileDto
  ) {
    // 1. 파일 업로드 처리
    let profileImageUrl = user.profileImage;
    if (file) {
      // gcsService, s3 등 외부 이미지 업로드
      profileImageUrl = await this.gcsService.uploadFile(file);
    }

    // 2. 이름 및 이미지 갱신
    const updated = await this.usersService.update(user.id, {
      name: dto.name ?? user.name,
      profileImage: profileImageUrl,
    });
    return new UserResponseDto(updated);
  }

  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE.ADMIN)
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

  @Put('me/password')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '내 비밀번호 변경', description: '현재 로그인 사용자가 자기 비밀번호를 변경합니다.' })
  @ApiResponse({ status: 200, description: '비밀번호가 성공적으로 변경되었습니다.' })
  @ApiResponse({ status: 400, description: '비밀번호 일치하지 않음 / 검증 실패 등', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async changeMyPassword(
    @RequestUser() user: UserResponseDto,
    @Body() body: UserChangePasswordDto
  ): Promise<{ message: string }> {
    // 회원 전용: 본인만 가능!
    await this.usersService.changePassword(
      user.email,
      body.currentPassword,
      body.newPassword,
      body.confirmPassword
    );
    return { message: '비밀번호가 성공적으로 변경되었습니다.' };
  }

  @Delete('me')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '회원 탈퇴', description: '회원 탈퇴를 합니다.' })
  @ApiParam({ name: 'id', description: '사용자 ID', type: Number })
  @ApiResponse({ status: 200, description: '사용자가 성공적으로 삭제되었습니다.' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async deleteMe(@RequestUser() user: UserResponseDto,
  ): Promise<{ message: string }> {
    await this.usersService.remove(user.id);
    return { message: '회원 탈퇴가 완료되었습니다.' };
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