// src/modules/auth/guards/naver-auth.guard.ts
import { ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class NaverAuthGuard extends AuthGuard('naver') {
  constructor(@Inject(REQUEST) private request: Request) {
    super();
  }

  getAuthenticateOptions(context: ExecutionContext): any {
    const request = context.switchToHttp().getRequest<Request>();
    let origin = request.query.origin as string;

    const allowedOrigins = [
      'http://localhost:3000', // 개발용 프론트 경로
      'https://eveyday-umo.site', // 배포용 프론트 경로
      // 필요한 경우 다른 경로 추가
    ];
    if (!origin || !allowedOrigins.includes(origin)) {
      console.warn(
        `Invalid or missing origin for OAuth redirect: ${origin}. Using default.`,
      );
      origin = 'https://eveyday-umo.site';
    }

    const stateObject = {
      origin: origin,
      nonce: Math.random().toString(36).substring(7),
    };
    const encodedState = Buffer.from(JSON.stringify(stateObject)).toString(
      'base64',
    );

    return { state: encodedState };
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || (!user && !info)) {
      throw err || new UnauthorizedException();
    }

    // user가 false이지만 info가 있는 경우 (신규 사용자) -> user 대신 info.profile을 반환
    if (!user && info?.profile) {
      // info와 info.profile 존재 여부 확인
      // 컨트롤러에서 @RequestUser()가 profile 객체를 받도록 함
      return info.profile;
    }
    // user가 있는 경우 (기존 사용자) -> user 반환
    return user;
  }
}
