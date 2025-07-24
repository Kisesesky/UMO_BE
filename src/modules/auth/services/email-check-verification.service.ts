//src/modules/auth/email-check-verification.service.ts
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as nodemailer from 'nodemailer';
import { getUmoVerificationLinkTemplate } from 'src/common/templates/email-check-templates';
import { AppConfigService } from 'src/config/app/config.service';
import { v4 as uuidv4 } from 'uuid';

type VerificationType = 'signup' | 'password';

@Injectable()
export class EmailCheckVerificationService {
  private readonly logger = new Logger(EmailCheckVerificationService.name);
  private transporter: any;

  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private appConfigService: AppConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.appConfigService.gmailUser,
        pass: this.appConfigService.gmailPass,
      },
    });
  }

  private getTokenKey(token: string) {
    return `email-verify-token:${token}`;
  }

  private getVerifiedKey(email: string) {
    return `verified:${email}`;
  }

  async sendVerificationLink(to: string, type: VerificationType = 'signup'): Promise<void> {
    // 1분 쿨타임, 하루 5회 제한은 동일하게 적용
    const cooldownKey = `email-cooldown:${to}`;
    const cooldown = await this.cacheManager.get(cooldownKey);
    if (cooldown) {
      throw new InternalServerErrorException('1분 후에 다시 시도해주세요.');
    }

    const today = new Date().toISOString().slice(0, 10);
    const countKey = `email-count:${to}:${today}`;
    let count = Number(await this.cacheManager.get(countKey)) || 0;
    if (count >= 5) {
      throw new InternalServerErrorException('하루 최대 5회까지만 인증 메일을 받을 수 있습니다.');
    }

    try{
      // 1. 토큰 생성 및 저장 (10분 유효)
      const token = uuidv4();
      await this.cacheManager.set(this.getTokenKey(token), to, 600); // 10분

      // 2. 쿨타임, 횟수 제한 적용
      await this.cacheManager.set(cooldownKey, '1', 60); // 1분 쿨타임
      await this.cacheManager.set(countKey, count + 1, 24 * 60 * 60); // 24시간 카운트

      // 3. 인증 링크 생성
      const verifyUrl = `https://localhost:3000/api/v1/auth/verify-email?token=${token}`;
      const html = getUmoVerificationLinkTemplate(verifyUrl, type);

      const subject =
        type === 'signup'
          ? '[UMO] 회원가입 이메일 인증 링크입니다.'
          : '[UMO] 비밀번호 재설정을 위한 인증번호입니다.';

      // 4. 이메일 발송
      await this.transporter.sendMail({
        from: this.appConfigService.gmailUser,
        to,
        subject,
        html,
        attachments: [
          { filename: 'umo-logo.png', path: this.appConfigService.defaultLogoImg, cid: 'umo-logo' },
          { filename: 'umo-face2.png', path: this.appConfigService.defaultProfileImg, cid: 'umo-face2' }
        ],
      });

      if(process.env.NODE_ENV === 'development') {
        this.logger.log(`인증코드: ${token}`)
      }
    } catch (error) {
      this.logger.error('Cache error:', error)
      throw new InternalServerErrorException('인증 코드 생성 중 오류가 발생하였습니다.')
    }
  }

  // 인증 링크 클릭 시 호출되는 메서드
  async verifyToken(token: string): Promise<boolean> {
    const email = await this.cacheManager.get(this.getTokenKey(token));
    if (!email) {
      this.logger.warn(`잘못됐거나 만료된 토큰: ${token}`);
      return false;
    }
    await this.cacheManager.del(this.getTokenKey(token));
    await this.cacheManager.set(this.getVerifiedKey(email), 'true', 86400); // 24시간 인증 상태 유지
    return true;
  }

  async isEmailVerified(email: string): Promise<boolean> {
    const verified = await this.cacheManager.get(this.getVerifiedKey(email));
    return verified === 'true';
  }
}
