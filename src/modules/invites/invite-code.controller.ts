// src/modules/invites/invite-code.controller.ts
import { Controller, Get, NotFoundException, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InviteCodeCheckResponseDto, InviteCodeResponseDto } from './dto/invite-code-response.dto';
import { InviteCodeService } from './invite-code.service';

@ApiTags('InviteCode')
@Controller('invites')
export class InviteCodeController {
  constructor(private inviteCodeService: InviteCodeService) {}

  @ApiOperation({ summary: '내 초대코드 가져오기' })
  @ApiBearerAuth()
  @ApiResponse({ type: InviteCodeResponseDto })
  @UseGuards(JwtAuthGuard)
  @Get('me/code')
  async getMyCode(@Req() req): Promise<InviteCodeResponseDto> {
    const code = await this.inviteCodeService.getUserInviteCode(req.user.id);
    if (!code) throw new NotFoundException('초대코드가 존재하지 않습니다.');
    return { inviteCode: code };
  }

  @ApiOperation({ summary: '초대코드 유효성 검증' })
  @ApiResponse({ type: InviteCodeCheckResponseDto })
  @Get(':code')
  async checkCode(@Param('code') code: string): Promise<InviteCodeCheckResponseDto> {
    const invite = await this.inviteCodeService.validateInviteCode(code);
    if (!invite) return { valid: false };
    return { valid: true, ownerId: invite.owner.id.toString(), createdAt: invite.createdAt };
  }
}
