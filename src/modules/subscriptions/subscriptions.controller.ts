// src/modules/subscriptions/subscriptions.controller.ts
import { Controller, Get, Param, UseGuards, ForbiddenException, NotFoundException, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestUser } from '../../common/decorators/request-user.decorator';
import { UserResponseDto } from '../../modules/users/dto/user-response.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { USER_ROLE } from 'src/common/constants/user-role';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '내 이용권 목록 조회', description: '로그인한 사용자의 이용권 목록을 조회합니다.' })
  @ApiResponse({ status: 200, description: '이용권 목록 조회 성공', type: [SubscriptionResponseDto] })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async findMySubscriptions(@RequestUser() user: UserResponseDto) {
    const subscriptions = await this.subscriptionsService.findByUserId(user.id);
    return subscriptions.map(subscription => new SubscriptionResponseDto({
      ...subscription,
      product: subscription.product
    }));
  }

  @Get('active')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '활성 이용권 조회', description: '로그인한 사용자의 현재 활성화된 이용권을 조회합니다.' })
  @ApiResponse({ status: 200, description: '활성 이용권 조회 성공', type: SubscriptionResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '활성 이용권을 찾을 수 없음', type: ErrorResponseDto }) // (서비스에서 null 반환 시)
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async findActiveSubscription(@RequestUser() user: UserResponseDto) {
    const subscription = await this.subscriptionsService.findActiveSubscription(user.id);
    if (!subscription) {
      throw new NotFoundException('활성 이용권을 찾을 수 없습니다.');
    }
    return new SubscriptionResponseDto({
      ...subscription,
      product: subscription.product
    });
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '이용권 상세 조회', description: '특정 이용권의 상세 정보를 조회합니다.' })
  @ApiParam({ name: 'id', description: '이용권 ID', type: Number })
  @ApiResponse({ status: 200, description: '이용권 상세 조회 성공', type: SubscriptionResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '이용권을 찾을 수 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async findOne(@Param('id') id: number, @RequestUser() user: UserResponseDto) {
    const subscription = await this.subscriptionsService.findOne(id);
    // 본인의 이용권만 조회 가능 (관리자는 모든 이용권 조회 가능)
    if (subscription.userId !== user.id && user.role !== USER_ROLE.ADMIN) {
      throw new ForbiddenException('다른 사용자의 이용권을 조회할 권한이 없습니다.');
    }
    return new SubscriptionResponseDto({
      ...subscription,
      product: subscription.product
    });
  }

  // 관리자용 또는 스케줄러용 엔드포인트는 필요에 따라 추가
  // 예: @Patch(':id/cancel')
  @Post(':id/cancel')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_ROLE.ADMIN)
  @ApiOperation({ summary: '이용권 취소 (관리자용)', description: '특정 이용권을 취소 상태로 변경합니다.' })
  @ApiParam({ name: 'id', description: '이용권 ID', type: Number })
  @ApiResponse({ status: 200, description: '이용권 취소 성공', type: SubscriptionResponseDto })
  @ApiResponse({ status: 400, description: '취소할 수 없는 이용권 상태', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '권한 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '이용권을 찾을 수 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async cancelSubscription(@Param('id') id: number): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionsService.cancelSubscription(id);
    return new SubscriptionResponseDto({ ...subscription, product: subscription.product });
  }
}