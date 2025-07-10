// src/common/dto/error-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 400, description: 'HTTP 상태 코드' })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request', description: 'HTTP 상태 메시지' })
  error: string; // HTTP 에러 이름 (예: Bad Request, Not Found)

  @ApiProperty({ example: '요청 본문이 유효하지 않습니다.', description: '클라이언트에게 보여줄 에러 메시지' })
  message: string | string[]; // 단일 메시지 또는 유효성 검사 오류 목록

  @ApiProperty({ example: '/auth/register', description: '요청 경로' })
  path: string;

  @ApiProperty({ example: '2023-10-26T14:30:00.000Z', description: '에러 발생 시간 (ISO 8601)' })
  timestamp: string;

  @ApiProperty({ example: 'USER_EMAIL_EXISTS', description: '내부 에러 코드 (선택 사항)', required: false })
  code?: string; // 비즈니스 로직에 따른 내부 에러 코드 (예: USER_001)

  @ApiProperty({
    example: {
      email: '이메일 형식이 올바르지 않습니다.',
      password: '비밀번호는 최소 8자 이상이어야 합니다.'
    },
    description: '유효성 검사 오류 등 상세 정보 (선택 사항)',
    required: false
  })
  details?: Record<string, any>; // 유효성 검사 오류 등 더 상세한 에러 정보
}