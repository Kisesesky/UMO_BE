// src/common/utils/password-util.ts
import * as bcrypt from 'bcrypt';

export class PasswordUtil { // 클래스 형태로 묶음
  private static readonly SALT_ROUNDS = 10; // 솔트 라운드 수 정의

  static async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(PasswordUtil.SALT_ROUNDS); // 솔트 라운드 사용
    return bcrypt.hash(password, salt);
  }

  static async compare(plainPassword: string, hashedPassword?: string): Promise<boolean> {
    if (!hashedPassword) return false
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static validatePassword(password: string): void {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!regex.test(password)) {
      throw new Error(
        '비밀번호는 최소 8자 이상, 영문 대소문자, 숫자, 특수문자를 포함해야 합니다.',
      );
    }
  }
}
