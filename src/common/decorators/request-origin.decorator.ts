// src/common/decorators/request-origin.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestOrigin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // req.headers.origin은 CORS 요청 시 사용
    // req.headers.referer는 이전 페이지 URL
    // req.headers.host는 요청된 호스트
    // 'localhost'는 폴백 값
    return request.headers['origin'] || request.headers['referer'] || request.headers['host'] || 'localhost';
  },
);
