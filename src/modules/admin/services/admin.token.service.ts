// src/modules/admin/services/admin.token.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from 'src/config/app/config.service';
import { CookieUtil } from 'src/common/utils/cookie-util';
import { TimeUtil } from 'src/common/utils/time-util';

@Injectable()
export class AdminTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
  ) {}

  setJwtAccessToken(payload: { sub: number; email: string; role: string }, requestDomain: string) {
    const maxAge = TimeUtil.convertExpiresInToMs(this.appConfigService.adminAccessExpiresIn);
    const accessToken = this.jwtService.sign(payload, {
      secret: this.appConfigService.adminJwtSecret ?? '',
      expiresIn: this.appConfigService.adminAccessExpiresIn ?? '',
    });
    const accessOptions = CookieUtil.getCookieOptions(maxAge, requestDomain, false);
    return { accessToken, accessOptions };
  }

  setJwtRefreshToken(payload: { sub: number; email: string; role: string }, requestDomain: string) {
    const maxAge = TimeUtil.convertExpiresInToMs(this.appConfigService.adminJwtRefreshExpiresIn);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.appConfigService.adminJwtRefreshSecret ?? '',
      expiresIn: this.appConfigService.adminJwtRefreshExpiresIn ?? '',
    });
    const refreshOptions = CookieUtil.getCookieOptions(maxAge, requestDomain, true);
    return { refreshToken, refreshOptions };
  }

  makeJwtToken(
    payload: { sub: number; email: string; role: string },
    origin: string,
  ) {
    const { accessToken, accessOptions } = this.setJwtAccessToken(payload, origin);
    const { refreshToken, refreshOptions } = this.setJwtRefreshToken(payload, origin);

    return {
      accessToken,
      refreshToken,
      accessOptions,
      refreshOptions,
    };
  }

  verifyRefreshToken(token: string) {
    return this.jwtService.verify(token, {
      secret: this.appConfigService.adminJwtRefreshSecret,
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
