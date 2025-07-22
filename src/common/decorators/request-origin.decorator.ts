// src/common/decorators/request-origin.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestOrigin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const origin = request.headers['origin'];
    if (origin) return origin;

    const referer = request.headers['referer'];
    if (referer) {
      try {
        return new URL(referer).origin;
      } catch (e) {
        return 'localhost';
      }
    }

    return 'localhost';
  },
);
