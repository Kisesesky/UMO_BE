// src/modules/payments/dto/payment-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';

export class PaymentResponseDto extends BaseResponseDto {
  constructor(entity?: any) {
    super(entity || {});
  }

  @ApiProperty({ description: '결제 성공 여부', example: true })
  success: boolean;

  @ApiProperty({ description: '결제 메시지', example: '결제가 성공적으로 완료되었습니다.' })
  message: string;

  @ApiProperty({ description: '결제 정보', example: { imp_uid: 'imp_123456789', merchant_uid: 'merchant_123456789', amount: 10000 } })
  paymentData: any;
}