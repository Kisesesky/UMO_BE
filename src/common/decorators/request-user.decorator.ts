// src/common/decorators/request-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // req.user는 JwtStrategy의 validate 메서드에서 반환하는 값
    return request.user;
  },
);
