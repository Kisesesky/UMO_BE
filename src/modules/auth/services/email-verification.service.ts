import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as nodemailer from 'nodemailer';
import { getUmoVerificationCodeTemplate } from 'src/common/templates/email-code-templates';
import { AppConfigService } from 'src/config/app/config.service';

type VerificationType = 'signup' | 'password';

@Injectable()
export class EmailVerificationService {
  private readonly logger = new Logger(EmailVerificationService.name);
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

  private getVerificationKey(email: string) {
    return `verification:${email}`;
  }

  private getVerifiedKey(email: string) {
    return `verified:${email}`;
  }

  async sendVerificationCode(to: string, type: VerificationType = 'signup'): Promise<void> {
    // 1분 쿨타임 체크
    const cooldownKey = `email-cooldown:${to}`;
    const cooldown = await this.cacheManager.get(cooldownKey);
    if(cooldown) {
      throw new InternalServerErrorException('1분 후에 다시 시도해주세요.!')
    }

    // 2. 하루 5회 제한 체크
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const countKey = `email-count:${to}:${today}`;
    let count = Number(await this.cacheManager.get(countKey)) || 0;
    if (count >= 5) {
      throw new InternalServerErrorException('하루 최대 5회까지만 인증번호를 받을 수 있습니다.');
    }

    // 3. 인증번호 생성 및 저장
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await this.cacheManager.set(this.getVerificationKey(to), code, 300); // 인증번호 5분 유효
      await this.cacheManager.set(cooldownKey, '1', 60); // 1분 쿨타임
      await this.cacheManager.set(countKey, count + 1, 24 * 60 * 60); // 24시간 카운트
      
      const subject =
        type === 'signup'
          ? '[UMO] 회원가입을 위한 인증번호입니다.'
          : '[UMO] 비밀번호 재설정을 위한 인증번호입니다.';

      const html = getUmoVerificationCodeTemplate(code, type);
      const mailOptions = {
        from: this.appConfigService.gmailUser,
        to,
        subject,
        html,
        attachments: [
          { filename: 'umo-logo.png', path: 'assets/logo/umo-logo.png', cid: 'umo-logo' },
          { filename: 'umo-face2.png', path: 'assets/character/umo-face2.png', cid: 'umo-face2' }
        ],
      };
      await this.transporter.sendMail(mailOptions);

      if(process.env.NODE_ENV === 'development') {
        this.logger.log(`인증코드: ${code}`)
      }
    } catch (error) {
      this.logger.error('Cache error:', error)
      throw new InternalServerErrorException('인증 코드 생성 중 오류가 발생하였습니다.')
    }
  }

  async verifyCode(email: string, code: string): Promise<boolean> {
    const storedCode = await this.cacheManager.get(this.getVerificationKey(email));
    if (!storedCode || storedCode.toString().trim() !== code.trim()) {
      this.logger.warn(`이메일: ${email}, 인증 코드 불일치 또는 만료 (입력코드: ${code})`);
      return false;
    }

    await this.cacheManager.del(this.getVerificationKey(email));
    await this.cacheManager.set(this.getVerifiedKey(email), 'true', 86400); // 24시간 인증 상태 유지
    return true;
  }

  async isEmailVerified(email: string): Promise<boolean> {
    const verified = await this.cacheManager.get(this.getVerifiedKey(email));
    return verified === 'true';
  }
}
