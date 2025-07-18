// src/modules/auth/auth.service.ts
import { Injectable, Logger, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { RegisterDto } from '../dto/register.dto';
import { PasswordUtil } from 'src/common/utils/password-util';
import { UserEmailExistsException, UserInvalidPasswordException, UserNotFoundException, UserAccountStatusException, UserBannedException, UserSuspendedException } from 'src/common/exceptions/user.exceptions';
import { CookieOptions } from 'express';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { AppConfigService } from 'src/config/app/config.service';
import { TimeUtil } from 'src/common/utils/time-util';
import { User } from '../../users/entities/user.entity';
import { RegisterStatus } from 'src/common/constants/register-status';
import * as bcrypt from 'bcrypt';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { LoginAttemptService } from 'src/modules/admin/services/login-attempt.service';
import { USER_STATUS } from 'src/common/constants/user-status';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private appConfigService: AppConfigService,
    private loginAttemptService: LoginAttemptService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);

      // 1. 계정 상태 체크 (예: SUSPENDED, BANNED)
      if (user.status === 'SUSPENDED') {
        throw new UserAccountStatusException(`${UserSuspendedException} 관리자에게 문의하세요`);
      }
      if (user.status === 'BANNED') {
        throw new UserBannedException();
      }

      // 2. 로그인 시도 제한 체크
      const isLocked = await this.loginAttemptService.isLocked(email);
      if (isLocked) {
        throw new UnauthorizedException('로그인 시도 횟수 초과로 계정이 잠겼습니다. 잠시 후 다시 시도해주세요.');
      }

      // 3. 비밀번호 검증
      if (!user.password) {
        throw new UserInvalidPasswordException();
      }
      const isPasswordValid = await PasswordUtil.compare(password, user.password);
      if (!isPasswordValid) {
        // 실패 시 카운트 증가
        const attempts = await this.loginAttemptService.recordFailure(email);
        // 임계치 도달 시 계정 상태 변경(선택)
        if (attempts >= 5) {
          await this.usersService.userChangeStatus(user.id, USER_STATUS.SUSPENDED);
        }
        throw new UserInvalidPasswordException();
      }

      // 4. 로그인 성공 시 실패 카운트 초기화
      await this.loginAttemptService.resetAttempts(email);

      const { password: _, ...result } = user;
      return result;

    } catch (error) {
      // 이 부분은 유지 - 로그인 실패 시 명확한 에러 메시지를 위해
      if (error instanceof UserNotFoundException || error instanceof UserInvalidPasswordException) {
        throw error;
      }
      this.logger.error(`Unexpected error during user validation for email ${email}: ${error.message}`, error.stack);
      throw new UnauthorizedException('사용자 인증 중 오류가 발생했습니다.');
    }
  }

  async login(user: User, origin: string): Promise<AuthResponseDto> {
    const { accessToken, refreshToken } = this.makeJwtToken(user.email, origin);
  
    return {
      user: new UserResponseDto(user),
      accessToken,
      refreshToken,
    };
  }

  async verifyPassword(userId: number, password: string): Promise<boolean> {
    const user = await this.usersService.findUserById(userId);
    if (!user || !user.password) return false;
  
    return await bcrypt.compare(password, user.password);
  }

  async validateSocialLogin(profile: {
    provider: string;
    providerId: string;
    email: string;
    name?: string;
    avatar?: string;
  }): Promise<User> {
    // UsersService에서 소셜 유저 처리
    return this.usersService.findOrCreateSocialUser({
      provider: profile.provider as RegisterStatus,
      socialId: profile.providerId,
      email: profile.email,
      name: profile.name,
      profileImage: profile.avatar,
    });
    ;
  }

  async register(registerDto: RegisterDto) {
    try {
      await this.usersService.findByEmail(registerDto.email);
      throw new UserEmailExistsException();
    } catch (error) {
      if (error instanceof UserEmailExistsException) {
        throw error;
      }
      // UserNotFoundException은 정상 흐름이므로 무시
      if (!(error instanceof UserNotFoundException)) {
        throw new InternalServerErrorException('회원가입 처리 중 오류가 발생했습니다.');
      }
    }

    const user = await this.usersService.create(registerDto);
    const { password: _, ...result } = user;
    return result;
  }

  async refreshToken(refreshToken: string, origin: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.appConfigService.jwtRefreshSecret,
      });
      
      const user = await this.usersService.findByEmail(payload.sub);
      if (!user) {
        throw new UserNotFoundException();
      }
      
      const { accessToken, accessOptions } = this.setJwtAccessToken(user.email, origin);
      
      return {
        user: new UserResponseDto(user),
        accessToken,
        accessOptions,
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('유효하지 않거나 만료된 리프레시 토큰입니다.');
      }
      throw error;
    }
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

  setJwtAccessToken(email: string, requestDomain: string) {
    const payload = { sub: email };
    const maxAge = TimeUtil.convertExpiresInToMs(this.appConfigService.accessExpiresIn);
    const accessToken = this.jwtService.sign(payload, {
      secret: this.appConfigService.jwtSecret ?? '',
      expiresIn: this.appConfigService.accessExpiresIn ?? '',
    });
    return {
      accessToken,
      accessOptions: this.setCookieOption(maxAge, requestDomain, false),
    };
  }

  setJwtRefreshToken(email: string, requestDomain: string) {
    const payload = { sub: email };
    const maxAge = TimeUtil.convertExpiresInToMs(this.appConfigService.jwtRefreshExpiresIn);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.appConfigService.jwtRefreshSecret ?? '',
      expiresIn: this.appConfigService.jwtRefreshExpiresIn ?? '',
    });
    return {
      refreshToken,
      refreshOptions: this.setCookieOption(maxAge, requestDomain, true),
    };
  }

  setCookieOption(
    maxAge: number,
    requestDomain: string,
    isHttpOnly = true,
  ): CookieOptions {
    let domain: string | undefined;
    let isLocalhost = false;

    if (
      requestDomain.includes('127.0.0.1') ||
      requestDomain.includes('localhost')
    ) {
      isLocalhost = true;
      domain = undefined;
    } else {
      try {
        const url = new URL(
          requestDomain.startsWith('http') ? requestDomain : `https://${requestDomain}`,
        );
        const parsedDomain = url.hostname.replace(/^www\./, '');
        // 프론트 도메인과 서버 도메인이 다르면 domain 설정하지 않음
        if (parsedDomain.endsWith('everyday-umo.site')) {
          domain = '.everyday-umo.site';
        }
      } catch (e) {
        this.logger.error(`Invalid requestDomain for URL parsing: ${requestDomain}. Falling back to hostname.`, e.stack);
      }
    }
  
    const cookieOptions: CookieOptions = {
      path: '/',
      httpOnly: isHttpOnly,
      maxAge,
      secure: !isLocalhost,         // 🔧 로컬에서는 false
      sameSite: isLocalhost ? 'lax' : 'none', // 🔧 크로스도메인이 아니므로 'lax'로
    };
  
    if (domain) {
      cookieOptions.domain = domain;
    }
  
    return cookieOptions;
  }

  expireJwtToken(requestDomain: string) {
    const accessOptions = this.setCookieOption(0, requestDomain, false);
    const refreshOptions = this.setCookieOption(0, requestDomain, true);
    return {
      accessOptions,
      refreshOptions,
    };
  }
}