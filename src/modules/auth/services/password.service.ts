import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { PasswordUtil } from 'src/common/utils/password-util';
import { UsersService } from 'src/modules/users/users.service';
import { UserNotFoundException } from 'src/modules/users/exceptions/user.exceptions';

@Injectable()
export class PasswordService {
  constructor(
    private usersService: UsersService,
    private emailVerificationService: EmailVerificationService,
  ) {}

  async sendPasswordFindEmail(email: string): Promise<string> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('존재하지 않는 이메일입니다.');
    
    await this.emailVerificationService.sendVerificationCode(email, 'password');
    return '인증 코드가 이메일로 발송되었습니다.';
  }

  async verifyPasswordFindCode(email: string, code: string): Promise<string> {
    const isVerified = await this.emailVerificationService.verifyCode(email, code);
    if (!isVerified) throw new UnauthorizedException('잘못된 인증 코드입니다.');
    return '인증이 완료되었습니다.';
  }

  async resetForgottenPassword(email: string, newPassword: string, confirmPassword: string): Promise<string> {
    const isVerified = await this.emailVerificationService.isEmailVerified(email);
    if (!isVerified) throw new UnauthorizedException('이메일 인증이 필요합니다.');

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    PasswordUtil.validatePassword(newPassword);
    const hashedPassword = await PasswordUtil.hash(newPassword);
    await this.usersService.updatePassword(email, hashedPassword);

    return '비밀번호가 성공적으로 변경되었습니다.';
  }

  async changePassword(email: string, currentPassword: string, newPassword: string, confirmPassword: string): Promise<string> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UserNotFoundException();

    if (!(await PasswordUtil.compare(currentPassword, user.password))) {
      throw new UnauthorizedException('현재 비밀번호가 일치하지 않습니다.');
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('새 비밀번호가 일치하지 않습니다.');
    }

    PasswordUtil.validatePassword(newPassword);
    const hashedPassword = await PasswordUtil.hash(newPassword);
    await this.usersService.updatePassword(email, hashedPassword);

    return '비밀번호가 성공적으로 변경되었습니다.';
  }
}
