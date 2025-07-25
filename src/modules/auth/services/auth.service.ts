// src/modules/auth/auth.service.ts
import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterStatus } from 'src/common/constants/register-status';
import { UserAccountStatusException, UserBannedException, UserEmailExistsException, UserInvalidPasswordException, UserNotFoundException, UserSuspendedException } from 'src/modules/users/exceptions/user.exceptions';
import { CookieUtil } from 'src/common/utils/cookie-util';
import { PasswordUtil } from 'src/common/utils/password-util';
import { LoginAttemptService } from 'src/modules/admin/services/login-attempt.service';
import { USER_STATUS } from 'src/modules/users/constants/user-status';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { RegisterDto } from '../dto/register.dto';
import { UserTokenService } from './user.token.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private loginAttemptService: LoginAttemptService,
    private userTokenService: UserTokenService,
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

  async logIn(user: User, origin: string): Promise<AuthResponseDto> {
    const { accessToken, refreshToken } = this.userTokenService.makeJwtToken(user.email, origin);
  
    return {
      user: new UserResponseDto(user),
      accessToken,
      refreshToken,
    };
  }

  logout(origin: string) {
    const cookieOptions = CookieUtil.getCookieOptions(0, origin);

    return {
      accessOptions: cookieOptions,
      refreshOptions: cookieOptions,
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
      const payload = this.userTokenService.verifyRefreshToken(refreshToken);
      const user = await this.usersService.findByEmail(payload.sub);
      if (!user) throw new UserNotFoundException();
      
      const { accessToken, accessOptions } = this.userTokenService.setJwtAccessToken(user.email, origin);
      
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

  expireJwtToken(requestDomain: string) {
    return this.userTokenService.expireCookies(requestDomain);
  }
}