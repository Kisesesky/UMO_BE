// src/modules/auth/services/user.token.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from 'src/config/app/config.service';
import { CookieUtil } from 'src/common/utils/cookie-util';
import { CookieOptions } from 'express';
import { TimeUtil } from 'src/common/utils/time-util';

@Injectable()
export class UserTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
  ) {}

  setJwtAccessToken(email: string, requestDomain: string) {
    const payload = { sub: email };
    const maxAge = TimeUtil.convertExpiresInToMs(this.appConfigService.accessExpiresIn);
    const accessToken = this.jwtService.sign(payload, {
      secret: this.appConfigService.jwtSecret ?? '',
      expiresIn: this.appConfigService.accessExpiresIn ?? '',
    });
    const accessOptions = CookieUtil.getCookieOptions(maxAge, requestDomain, false);
    return { accessToken, accessOptions };
  }

  setJwtRefreshToken(email: string, requestDomain: string) {
    const payload = { sub: email };
    const maxAge = TimeUtil.convertExpiresInToMs(this.appConfigService.jwtRefreshExpiresIn);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.appConfigService.jwtRefreshSecret ?? '',
      expiresIn: this.appConfigService.jwtRefreshExpiresIn ?? '',
    });
    const refreshOptions = CookieUtil.getCookieOptions(maxAge, requestDomain, true);
    return { refreshToken, refreshOptions };
  }

  makeJwtToken(email: string, origin: string) {
    const { accessToken, accessOptions } = this.setJwtAccessToken(email, origin);
    const { refreshToken, refreshOptions } = this.setJwtRefreshToken(email, origin);

    return {
      accessToken,
      refreshToken,
      accessOptions,
      refreshOptions,
    };
  }

  verifyRefreshToken(refreshToken: string): any {
    return this.jwtService.verify(refreshToken, {
      secret: this.appConfigService.jwtRefreshSecret,
    });
  }

  expireCookies(requestDomain: string) {
    const accessOptions = CookieUtil.getCookieOptions(0, requestDomain, false);
    const refreshOptions = CookieUtil.getCookieOptions(0, requestDomain, true);
    return { 
      accessOptions, 
      refreshOptions, 
    };
  }
}
