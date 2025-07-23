// src/modules/invites/invite-code.service.ts
import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { InviteCode } from './entities/invite-code.entity';
import { InviteCodeFactory } from './invite-code.factory';

@Injectable()
export class InviteCodeService {
  private readonly logger = new Logger(InviteCodeService.name);

  constructor(
    @InjectRepository(InviteCode)
    private inviteCodeRepository: Repository<InviteCode>,
    private readonly inviteCodeFactory: InviteCodeFactory,
  ) {}

  private generateRandomCode(): string {
    return `UMBRELLA${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  }

  async generateInviteCodeForUser(user: User): Promise<InviteCode> {
    let code: string;
    let exists: InviteCode | null = null;
    let trial = 0;
    do {
      code = this.inviteCodeFactory.generate();
      exists = await this.inviteCodeRepository.findOne({ where: { code } });
      trial++;
      if (trial > 10) throw new ConflictException('초대코드 생성 실패');
    } while (exists);

    return this.inviteCodeRepository.save(this.inviteCodeRepository.create({ code, owner: user }));
  }

  async getUserInviteCode(userId: number): Promise<string | null> {
    const row = await this.inviteCodeRepository.findOne({ where: { owner: { id: userId } } });
    return row?.code ?? null;
  }

  async validateInviteCode(code: string): Promise<InviteCode | null> {
    return this.inviteCodeRepository.findOne({ where: { code }, relations: ['owner'] });
  }
}
