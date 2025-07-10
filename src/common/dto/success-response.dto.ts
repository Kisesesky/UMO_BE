// src/common/dto/success-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
  @ApiProperty({ example: true, description: '요청 성공 여부' })
  success: boolean;

  @ApiProperty({ example: '요청이 정상적으로 처리되었습니다.', description: '성공 메시지' })
  message: string;

  @ApiProperty({
    example: { userId: 123, email: 'user@example.com' },
    description: '응답 데이터(선택 사항). 성공 시 추가로 반환할 데이터',
    required: false,
  })
  data?: any;
}
