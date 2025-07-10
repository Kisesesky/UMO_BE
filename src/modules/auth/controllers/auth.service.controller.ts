import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Query, Res } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from 'express';
import { AuthService } from "../services/auth.service";
import { PasswordDto } from "../dto/password.dto";
import { SendEmailCodeDto } from "../dto/send-email-code.dto";
import { VerifyEmailCodeDto } from "../dto/verify-email-code.dto";
import { EmailCheckVerificationService } from "../services/email-check-verification.service";
import { EmailVerificationService } from "../services/email-verification.service";
import { PasswordService } from "../services/password.service";
import { ErrorResponseDto } from "src/common/dto/error-response.dto";
import { SuccessResponseDto } from "src/common/dto/success-response.dto";

@ApiTags('유저 서비스')
@Controller('auth/service')
export class AuthServiceController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly emailCheckVerificationService: EmailCheckVerificationService,
    private readonly passwordService: PasswordService,
  ) {}

  @Post('signup/sendcode')
  @ApiOperation({
    summary: '회원가입 이메일 인증코드 발송',
    description: '입력한 이메일 주소로 6자리 인증번호를 발송합니다. 인증번호는 2분간 유효합니다.',
  })
  @ApiBody({ type: SendEmailCodeDto })
  @ApiResponse({ status: 201, description: '인증 코드 전송 성공', type: SuccessResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 이메일 형식', type: ErrorResponseDto })
  @ApiResponse({ status: 429, description: '요청 제한 초과', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async sendCode(@Body() dto: SendEmailCodeDto) {
    await this.emailVerificationService.sendVerificationCode(dto.email);
    return { success: true, message: '인증 코드 전송 완료!, 제한시간 2분' };
  }

  @Post('signup/verifycode')
  @ApiOperation({
    summary: '회원가입 이메일 인증코드 검증',
    description: '입력한 이메일과 인증번호가 일치하는지 검증합니다. 인증 성공 시 회원가입을 계속할 수 있습니다.',
  })
  @ApiBody({ type: VerifyEmailCodeDto })
  @ApiResponse({ status: 200, description: '인증 성공', type: SuccessResponseDto })
  @ApiResponse({ status: 400, description: '인증 실패(코드 불일치/만료)', type: ErrorResponseDto })
  @HttpCode(HttpStatus.OK)
  async verifyCode(@Body() dto: VerifyEmailCodeDto) {
    const result = await this.emailVerificationService.verifyCode(dto.email, dto.code);
    if (!result) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: '인증 코드가 일치하지 않거나 만료된 코드입니다.',
        error: 'Bad Request',
      });
    }
    return { success: true, message: '인증완료' };
  }

  @Post('password/find/email')
  @ApiOperation({
    summary: '비밀번호 찾기 이메일 인증요청',
    description: '입력한 이메일로 비밀번호 재설정 인증번호를 발송합니다.',
  })
  @ApiBody({ type: SendEmailCodeDto })
  @ApiResponse({ status: 201, description: '인증 메일 전송 성공', type: SuccessResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 이메일 형식', type: ErrorResponseDto })
  @ApiResponse({ status: 429, description: '요청 제한 초과', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async sendPasswordFindEmail(@Body('email') email: string) {
    const message = await this.passwordService.sendPasswordFindEmail(email);
    return { success: true, message };
  }

  @Post('password/find/verify')
  @ApiOperation({
    summary: '비밀번호 찾기 이메일 인증코드 검증',
    description: '입력한 이메일과 인증번호가 일치하는지 검증합니다. 인증 성공 시 비밀번호 재설정이 가능합니다.',
  })
  @ApiBody({ type: VerifyEmailCodeDto })
  @ApiResponse({ status: 200, description: '인증 성공', type: SuccessResponseDto })
  @ApiResponse({ status: 400, description: '인증 실패(코드 불일치/만료)', type: ErrorResponseDto })
  async verifyPasswordFindCode(@Body() dto: VerifyEmailCodeDto) {
    const message = await this.passwordService.verifyPasswordFindCode(dto.email, dto.code);
    return { success: true, message };
  }

  @Patch('password/find/reset')
  @ApiOperation({
    summary: '비밀번호 찾기 이후 비밀번호 변경',
    description: '비밀번호 찾기 인증에 성공한 사용자가 새 비밀번호로 변경합니다.',
  })
  @ApiBody({ type: PasswordDto })
  @ApiResponse({ status: 200, description: '비밀번호 변경 성공', type: SuccessResponseDto })
  @ApiResponse({ status: 400, description: '비밀번호 형식 오류/불일치', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async resetForgottenPassword(@Body() dto: PasswordDto) {
    const message = await this.passwordService.resetForgottenPassword(dto.email, dto.newPassword, dto.confirmPassword);
    return { success: true, message };
  }

  @Post('signup/send-link')
  @ApiOperation({
    summary: '회원가입 이메일 인증 링크 발송',
    description: '입력한 이메일 주소로 인증 링크를 발송합니다. 링크는 10분간 유효합니다.',
  })
  @ApiBody({ type: SendEmailCodeDto })
  @ApiResponse({ status: 201, description: '인증 링크 전송 성공', type: SuccessResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 이메일 형식', type: ErrorResponseDto })
  @ApiResponse({ status: 429, description: '요청 제한 초과', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async sendVerificationLink(@Body() dto: SendEmailCodeDto) {
    await this.emailCheckVerificationService.sendVerificationLink(dto.email);
    return { success: true, message: '인증 링크 전송 완료! 10분 이내에 인증하세요.' };
  }

  @Get('verify-email')
  @ApiOperation({
    summary: '회원가입 이메일 인증 링크 검증',
    description: '이메일로 받은 인증 링크의 토큰을 검증합니다. 성공 시 회원가입을 계속 진행할 수 있습니다.',
  })
  @ApiResponse({ status: 200, description: '이메일 인증 성공', schema: { example: '이메일 인증이 완료되었습니다! 이제 회원가입을 계속 진행하세요.' }, type: SuccessResponseDto })
  @ApiResponse({ status: 400, description: '유효하지 않거나 만료된 인증 링크', schema: { example: '유효하지 않거나 만료된 인증 링크입니다.' }, type: ErrorResponseDto })
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    const result = await this.emailCheckVerificationService.verifyToken(token);
    if (result) {
      return res.send('이메일 인증이 완료되었습니다! 이제 회원가입을 계속 진행하세요.');
    } else {
      return res.status(400).send('유효하지 않거나 만료된 인증 링크입니다.');
    }
  }

}
