// src/rentals/rentals.controller.ts
import { Controller, Get, Post, Body, Param, Put, HttpStatus, ParseIntPipe, UseGuards, ForbiddenException } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { RentUmbrellaDto } from './dto/rent-umbrella.dto';
import { ReturnUmbrellaDto } from './dto/return-umbrella.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { RentalResponseDto } from './dto/rental-response.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestUser } from 'src/common/decorators/request-user.decorator';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { USER_ROLE } from 'src/modules/users/constants/user-role';

@ApiTags('rentals')
@ApiExtraModels(RentalResponseDto, ErrorResponseDto)
@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Get()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '모든 대여 정보 조회', description: '시스템에 등록된 모든 우산 대여 정보를 조회합니다.' })
  @ApiResponse({
    status: 200,
    description: '성공적으로 모든 대여 정보를 반환합니다.',
    type: [RentalResponseDto],
  })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto }) // 추가
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto }) // 추가
  async findAll(): Promise<RentalResponseDto[]> {
    const rentals = await this.rentalsService.findAll();
    // 서비스에서 받은 Rental 엔티티를 RentalResponseDto로 변환하여 반환
    return rentals.map(rental => new RentalResponseDto(rental));
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '특정 대여 정보 조회', description: 'ID를 통해 특정 우산 대여 정보를 조회합니다.' })
  @ApiResponse({ status: 200, description: '성공적으로 대여 정보를 반환합니다.', type: RentalResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto }) // 추가
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto }) // 추가
  @ApiResponse({ status: 404, description: '대여 정보를 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto }) // 추가
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @RequestUser() user: UserResponseDto
  ): Promise<RentalResponseDto> {
    const rental = await this.rentalsService.findOne(id);
    // 본인의 대여만 조회 가능 (관리자는 모든 대여 조회 가능)
    if (rental.user.id !== user.id && user.role !== USER_ROLE.ADMIN) {
      throw new ForbiddenException('다른 사용자의 대여를 조회할 권한이 없습니다.');
    }
    return new RentalResponseDto(rental);
  }

  @Post('rent')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '우산 대여 요청', description: '로그인한 사용자가 우산을 대여 요청합니다. 초기 상태는 PENDING입니다.' })
  @ApiResponse({ status: 201, description: '대여 요청이 성공적으로 생성되었습니다.', type: RentalResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터 또는 잔액 부족.', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '사용자 또는 우산을 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto }) // 추가
  async rentUmbrella(
    @Body() rentDto: RentUmbrellaDto,
    @RequestUser() user: UserResponseDto,
  ): Promise<RentalResponseDto> {
    const rental = await this.rentalsService.rentUmbrella(user.id, rentDto.umbrellaId);
    return new RentalResponseDto(rental);
  }

  @Post(':id/confirm')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '대여 요청 확정', description: 'PENDING 상태의 대여 요청을 RENTED 상태로 확정합니다.' })
  @ApiResponse({ status: 200, description: '대여 요청이 성공적으로 확정되었습니다.', type: RentalResponseDto })
  @ApiResponse({ status: 400, description: '유효하지 않은 대여 요청 상태.', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto }) // 추가
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto }) // 추가
  @ApiResponse({ status: 404, description: '대여 정보를 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto }) // 추가
  async confirmRental(
    @Param('id', ParseIntPipe) id: number,
    @RequestUser() user: UserResponseDto,
  ): Promise<RentalResponseDto> {
    const rental = await this.rentalsService.findOne(id);
    // 본인의 대여만 확정 가능 (관리자는 모든 대여 확정 가능)
    if (rental.user.id !== user.id && user.role !== USER_ROLE.ADMIN) {
      throw new ForbiddenException('다른 사용자의 대여를 확정할 권한이 없습니다.');
    }
    return this.rentalsService.confirmRental(id);
  }

  @Put(':id/return')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '우산 반납', description: '대여 중인 우산을 반납 처리하고 요금을 정산합니다.' })
  @ApiResponse({ status: 200, description: '우산이 성공적으로 반납되었습니다.', type: RentalResponseDto })
  @ApiResponse({ status: 400, description: '이미 반납되었거나 유효하지 않은 상태.', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto }) // 추가
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto }) // 추가
  @ApiResponse({ status: 404, description: '대여 정보를 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto }) // 추가
  async returnUmbrella(
    @Param('id', ParseIntPipe) id: number,
    @Body() returnDto: ReturnUmbrellaDto,
    @RequestUser() user: UserResponseDto,
  ): Promise<RentalResponseDto> {
    const rental = await this.rentalsService.findOne(id);
    // 본인의 대여만 반납 가능 (관리자는 모든 대여 반납 가능)
    if (rental.user.id !== user.id && user.role !== USER_ROLE.ADMIN) {
      throw new ForbiddenException('다른 사용자의 우산을 반납할 권한이 없습니다.');
    }
    return this.rentalsService.returnUmbrella(id, returnDto.stationId);
  }

  @Put(':id/lost')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '우산 분실 처리', description: '대여 중인 우산을 분실 처리하고 분실 수수료를 부과합니다.' })
  @ApiResponse({ status: 200, description: '우산이 분실 처리되었습니다.', type: RentalResponseDto })
  @ApiResponse({ status: 400, description: '대여 중인 우산이 아님.', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto }) // 추가
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto }) // 추가
  @ApiResponse({ status: 404, description: '대여 정보를 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto }) // 추가
  async reportLostUmbrella(
    @Param('id', ParseIntPipe) id: number,
    @RequestUser() user: UserResponseDto,
  ): Promise<RentalResponseDto> {
    const rental = await this.rentalsService.findOne(id);
    // 본인의 대여만 분실 처리 가능 (관리자는 모든 대여 분실 처리 가능)
    if (rental.user.id !== user.id && user.role !== USER_ROLE.ADMIN) {
      throw new ForbiddenException('다른 사용자의 우산을 분실 처리할 권한이 없습니다.');
    }
    return this.rentalsService.reportLostUmbrella(id);
  }

  @Put(':id/cancel')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '대여 요청 취소', description: 'PENDING 상태의 대여 요청을 취소합니다.' })
  @ApiResponse({ status: 200, description: '대여 요청이 성공적으로 취소되었습니다.', type: RentalResponseDto })
  @ApiResponse({ status: 400, description: '대기 중인 대여가 아님.', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto }) // 추가
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto }) // 추가
  @ApiResponse({ status: 404, description: '대여 정보를 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto }) // 추가
  async cancelRental(
    @Param('id', ParseIntPipe) id: number,
    @RequestUser() user: UserResponseDto,
  ): Promise<RentalResponseDto> {
    const rental = await this.rentalsService.findOne(id);
    // 본인의 대여만 취소 가능 (관리자는 모든 대여 취소 가능)
    if (rental.user.id !== user.id && user.role !== USER_ROLE.ADMIN) {
      throw new ForbiddenException('다른 사용자의 대여를 취소할 권한이 없습니다.');
    }
    return this.rentalsService.cancelRental(id);
  }
}