// src/modules/admin/service/login-attempt.service.ts
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

const MAX_ATTEMPTS = 5;
const ATTEMPT_TTL = 60 * 10; // 10분(초)

@Injectable()
export class LoginAttemptService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  private getKey(email: string) {
    return `login-fail:${email}`;
  }

  // 로그인 실패 기록 및 카운트 반환
  async recordFailure(email: string): Promise<number> {
    const key = this.getKey(email);
    let count = Number(await this.cacheManager.get(key)) || 0;
    count += 1;
    // TTL 초기화: 실패 시마다 10분간 유지(마지막 실패 기준)
    await this.cacheManager.set(key, count, ATTEMPT_TTL);
    return count;
  }

  // 로그인 성공 시 실패 카운트 초기화
  async resetAttempts(email: string): Promise<void> {
    const key = this.getKey(email);
    await this.cacheManager.del(key);
  }

  // 현재 실패 횟수 조회
  async getAttempts(email: string): Promise<number> {
    const key = this.getKey(email);
    return Number(await this.cacheManager.get(key)) || 0;
  }

  // 계정 잠금 상태 여부 반환
  async isLocked(email: string): Promise<boolean> {
    const attempts = await this.getAttempts(email);
    return attempts >= MAX_ATTEMPTS;
  }
}
