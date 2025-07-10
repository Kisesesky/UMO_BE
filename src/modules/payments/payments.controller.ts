// src/modules/payments/payments.controller.ts
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '@nestjs/passport';
import { RequestUser } from 'src/common/decorators/request-user.decorator';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { VerifyPaymentRequestDto } from './dto/verify-payment-request.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('verify')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '결제 검증 및 츄르 지급', description: '클라이언트로부터 받은 결제 정보를 검증하고 츄르를 지급합니다.' })
  @ApiResponse({ status: 200, description: '결제 성공 및 츄르 지급 완료', type: PaymentResponseDto })
  @ApiResponse({ status: 400, description: '결제 검증 실패 또는 유효하지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async verifyPayment(
    @Body() verifyPaymentDto: VerifyPaymentRequestDto,
    @RequestUser() user: UserResponseDto,
  ): Promise<PaymentResponseDto> {
    const { imp_uid, merchant_uid, amount } = verifyPaymentDto;
    const result = await this.paymentsService.verifyPaymentAndDepositChuru(imp_uid, merchant_uid, amount, user.id);
    
    return new PaymentResponseDto({
      id: 0, 
      createdAt: new Date(),
      updatedAt: new Date(),
      success: result.success,
      message: result.message,
      paymentData: result.paymentData,
    });
  }
}