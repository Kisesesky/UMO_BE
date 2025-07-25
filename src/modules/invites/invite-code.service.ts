// src/modules/invites/invite-code.service.ts
import {
  Injectable,
  ConflictException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
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

  async generateInviteCodeForUser(user: User): Promise<InviteCode> {
    const MAX_ATTEMPTS = 10;

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      const code = this.inviteCodeFactory.generate();

      try {
        const newCode = this.inviteCodeRepository.create({ code, owner: user });
        return await this.inviteCodeRepository.save(newCode);
      } catch (error) {
        // UNIQUE 제약 위반일 경우만 재시도
        if (
          error?.code === '23505' || // PostgreSQL unique_violation
          error?.message?.includes('duplicate') // fallback
        ) {
          this.logger.warn(`Duplicate invite code generated: ${code}, retrying...`);
          continue;
        }
        throw new InternalServerErrorException('초대코드 저장 실패');
      }
    }

    throw new ConflictException('초대코드 생성에 실패했습니다.');
  }

  async getUserInviteCode(userId: number): Promise<string | null> {
    const row = await this.inviteCodeRepository.findOne({
      where: { owner: { id: userId } },
    });
    return row?.code ?? null;
  }

  async validateInviteCode(code: string): Promise<InviteCode | null> {
    return this.inviteCodeRepository.findOne({
      where: { code },
      relations: ['owner'],
    });
  }
}
