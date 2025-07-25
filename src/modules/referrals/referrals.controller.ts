// src/modules/referrals/referrals.controller.ts
import { Controller, Post, Body, UseGuards, Get, Query, Req, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReferralsService } from './referrals.service';
import { CreateReferralDto } from './dto/create-referral.dto';
import { ReferralResponseDto } from './dto/referral-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Referrals')
@ApiBearerAuth()
@Controller('referrals')
export class ReferralsController {
  constructor(
    private readonly referralsService: ReferralsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '신규 추천(친구초대) 기록',
    description: '추천코드 입력시 추천 관계를 생성합니다.',
  })
  @ApiResponse({ status: 201, type: ReferralResponseDto })
  @ApiResponse({ status: 400, description: '자기 추천, 잘못된 추천 코드 또는 중복 추천' })
  async create(@Body() dto: CreateReferralDto, @Req() req) {
    const signUpIp = req.ip || req.headers['x-forwarded-for'] || '';
    const referral = await this.referralsService.createReferral(
      dto.referredUserId,
      dto.referralCode,
      signUpIp,
    );
    return new ReferralResponseDto(referral);
  }  

  @Get('me/referring')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '내가 추천한 친구 목록',
    description: '내가 초대한 친구 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, type: [ReferralResponseDto] })
  async myReferrals(@Req() req) {
    const userId = req.user.id;
    const referrals = await this.referralsService.getReferralsByReferrer(userId);
    return referrals.map((r) => new ReferralResponseDto(r));
  }
  
  @Get('me/referred')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '내가 추천받은 이력',
    description: '내가 추천받은 이력을 확인합니다.',
  })
  @ApiResponse({ status: 200, type: [ReferralResponseDto] })
  async myReferees(@Req() req) {
    const userId = req.user.id;
    const referredList = await this.referralsService.getReferralsByReferred(userId);
    return referredList.map((r) => new ReferralResponseDto(r));
  }

  @Get('top')
  @ApiOperation({
    summary: '추천인 랭킹',
    description: '추천 성공 건수 랭킹을 조회합니다.',
  })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, schema: { example: [{ referrerId: 1, count: 5 }] } })
  async top(@Query('limit', ParseIntPipe) limit: number = 10) {
    return this.referralsService.getTopReferrers(limit);
  }
}
