// src/auth/strategies/kakao.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { SocialConfigService } from 'src/config/social/config.service';
import { UsersService } from 'src/modules/users/users.service';
import { RegisterStatus, REGISTER_STATUS } from 'src/common/constants/register-status';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  private readonly logger = new Logger(KakaoStrategy.name);

  constructor(
    private readonly socialConfigService: SocialConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: socialConfigService.kakaoClientId ?? '',
      clientSecret: socialConfigService.kakaoClientSecret ?? '',
      callbackURL: socialConfigService.kakaoCallbackUrl ?? '',
    });

    const { kakaoClientId, kakaoClientSecret, kakaoCallbackUrl } = socialConfigService;
    if (!kakaoClientId || !kakaoClientSecret || !kakaoCallbackUrl) {
      throw new Error('카카오 소셜 로그인 설정이 누락되었습니다.');
    }
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    try {
      const { id, username, _json } = profile;
      const kakaoAccount = _json.kakao_account;
      const email = kakaoAccount?.email;
      
      // 이메일이 없는 경우 처리
      if (!email) {
        this.logger.error('[Kakao Validate] 카카오 프로필에 이메일 없음.');
        return done(
          new UnauthorizedException(
            '카카오 계정에서 이메일 정보를 가져올 수 없습니다.',
          ),
        );
      }
      
      // 기존 사용자 찾기 또는 새 사용자 생성
      const user = await this.usersService.findOrCreateSocialUser({
        provider: REGISTER_STATUS.KAKAO,
        socialId: id.toString(),
        email: email,
        name: username || kakaoAccount?.profile?.nickname || email.split('@')[0],
      });
      
      return done(null, user);
    } catch (error) {
      this.logger.error(
        `[Kakao Validate] 유효성 검사 중 오류 발생: ${error.message}`,
        error.stack,
      );
      return done(error);
    }
  }
}  