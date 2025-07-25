// src/wallets/wallets.controller.ts
import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, ForbiddenException, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { WalletsService } from './wallets.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { WalletResponseDto } from './dto/wallet-response.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RequestUser } from 'src/common/decorators/request-user.decorator';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { USER_ROLE } from 'src/modules/users/constants/user-role';
import { WalletLogResponseDto } from './wallet-logs/dto/wallet-log-response.dto';

@ApiTags('wallets')
@Controller('wallets')
@UseGuards(JwtAuthGuard) // 모든 지갑 API는 인증 필요
@ApiBearerAuth('JWT-auth') // 모든 지갑 API는 JWT 인증 사용
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get('me') // 내 지갑 정보 조회
  @ApiOperation({ summary: '내 지갑 조회', description: '로그인한 사용자의 지갑 정보를 조회합니다.' })
  @ApiResponse({ status: 200, description: '성공적으로 지갑 정보를 반환합니다.', type: WalletResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '지갑을 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async findMyWallet(@RequestUser() user: UserResponseDto): Promise<WalletResponseDto> {
    const wallet = await this.walletsService.findByUserId(user.id);
    return new WalletResponseDto(wallet);
  }

  @Get('me/logs')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '내 월렛 거래내역', description: '적립/차감 내역 목록을 확인합니다.' })
  @ApiResponse({ status: 200, type: [WalletLogResponseDto] })
  async myLogs(@Req() req) {
    const userId = req.user.id;
    return this.walletsService.getWalletLogs(userId);
  }

  @Post('deposit/churu')
  @ApiOperation({ summary: '츄르 충전 (관리자용 또는 내부 로직용)', description: '특정 사용자의 지갑에 츄르를 충전합니다. (주로 내부 시스템 또는 관리자용)' })
  @ApiResponse({ status: 200, description: '성공적으로 츄르가 충전되었습니다.', type: WalletResponseDto })
  @ApiResponse({ status: 400, description: '유효하지 않은 금액입니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto }) // (관리자용인 경우)
  @ApiResponse({ status: 404, description: '지갑을 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async depositChuru(
    @RequestUser() user: UserResponseDto, // 관리자용 API라면 @Roles(USER_ROLE.ADMIN) 추가
    @Body() depositDto: DepositDto
  ): Promise<WalletResponseDto> {
    const wallet = await this.walletsService.depositChuru(user.id, depositDto.amount);
    return new WalletResponseDto(wallet);
  }

  @Post('withdraw/churu')
  @ApiOperation({ summary: '츄르 인출', description: '로그인한 사용자의 지갑에서 츄르를 인출합니다.' })
  @ApiResponse({ status: 200, description: '성공적으로 츄르가 인출되었습니다.', type: WalletResponseDto })
  @ApiResponse({ status: 400, description: '유효하지 않은 금액 또는 잔액 부족.', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '지갑을 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async withdrawChuru(
    @RequestUser() user: UserResponseDto,
    @Body() withdrawDto: WithdrawDto
  ): Promise<WalletResponseDto> {
    const wallet = await this.walletsService.withdrawChuru(user.id, withdrawDto.amount);
    return new WalletResponseDto(wallet);
  }

  @Post('deposit/catnip')
  @ApiOperation({ summary: '캣닢 충전 (관리자용 또는 내부 로직용)', description: '특정 사용자의 지갑에 캣닢을 충전합니다. (주로 내부 시스템 또는 관리자용)' })
  @ApiResponse({ status: 200, description: '성공적으로 캣닢이 충전되었습니다.', type: WalletResponseDto })
  @ApiResponse({ status: 400, description: '유효하지 않은 금액입니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto }) // (관리자용인 경우)
  @ApiResponse({ status: 404, description: '지갑을 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async addCatnip(
    @RequestUser() user: UserResponseDto,
    @Body() depositDto: DepositDto
  ): Promise<WalletResponseDto> {
    const wallet = await this.walletsService.addCatnip(user.id, depositDto.amount);
    return new WalletResponseDto(wallet);
  }

  @Post('withdraw/catnip')
  @ApiOperation({ summary: '캣닢 인출', description: '로그인한 사용자의 지갑에서 캣닢을 인출합니다.' })
  @ApiResponse({ status: 200, description: '성공적으로 캣닢이 인출되었습니다.', type: WalletResponseDto })
  @ApiResponse({ status: 400, description: '유효하지 않은 금액 또는 잔액 부족.', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '지갑을 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async withdrawCatnip(
    @RequestUser() user: UserResponseDto,
    @Body() withdrawDto: WithdrawDto
  ): Promise<WalletResponseDto> {
    const wallet = await this.walletsService.withdrawCatnip(user.id, withdrawDto.amount);
    return new WalletResponseDto(wallet);
  }

  @Get('balance/churu')
  @ApiOperation({ summary: '츄르 잔액 조회', description: '로그인한 사용자의 츄르 잔액을 조회합니다.' })
  @ApiResponse({ status: 200, description: '성공적으로 츄르 잔액을 반환합니다.' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '지갑을 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async getChuruBalance(@RequestUser() user: UserResponseDto): Promise<{ churuBalance: number }> {
    const balance = await this.walletsService.getChuruBalance(user.id);
    return { churuBalance: balance };
  }

  @Get('balance/catnip')
  @ApiOperation({ summary: '캣닢 잔액 조회', description: '로그인한 사용자의 캣닢 잔액을 조회합니다.' })
  @ApiResponse({ status: 200, description: '성공적으로 캣닢 잔액을 반환합니다.' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '지갑을 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async getCatnipBalance(@RequestUser() user: UserResponseDto): Promise<{ catnipBalance: number }> {
    const balance = await this.walletsService.getCatnipBalance(user.id);
    return { catnipBalance: balance };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '특정 사용자 지갑 조회 (관리자용)', description: '관리자가 특정 사용자의 지갑 정보를 조회합니다.' })
  @ApiParam({ name: 'userId', description: '사용자 ID', type: Number })
  @UseGuards(RolesGuard)
  @Roles(USER_ROLE.ADMIN)
  @ApiResponse({ status: 200, description: '성공적으로 지갑 정보를 반환합니다.', type: WalletResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '지갑을 찾을 수 없습니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async findWalletByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<WalletResponseDto> {
    const wallet = await this.walletsService.findByUserId(userId);
    return new WalletResponseDto(wallet);
  }
}