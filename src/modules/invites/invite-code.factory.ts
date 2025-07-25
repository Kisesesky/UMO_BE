// src/modules/invites/invite-code.factory.ts
import { Injectable } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { InviteCodeConfig } from './config/invite.oconfig';

@Injectable()
export class InviteCodeFactory {
  private readonly generator = customAlphabet(InviteCodeConfig.alphabet, InviteCodeConfig.length);

  /**
   * E.g. UMO20253kid3fdb
   */
  generate(): string {
    return `${InviteCodeConfig.prefix}${InviteCodeConfig.year}${this.generator()}`;
  }
}
