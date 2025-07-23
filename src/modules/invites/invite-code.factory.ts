// src/modules/invites/invite-code.factory.ts

import { Injectable } from '@nestjs/common';
import { customAlphabet } from 'nanoid';

@Injectable()
export class InviteCodeFactory {
  // 커스텀 nanoid: UMBRELLA + 7자리 대문자영문+숫자
  private readonly generator = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 7);

  /**
   * 초대코드를 생성합니다(E.g. UMBRELLA4JQ7P3A).
   */
  generate(): string {
    return `UMBRELLA${this.generator()}`;
  }
}
