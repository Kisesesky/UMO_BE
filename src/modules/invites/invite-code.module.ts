// src/modules/invites/invite-code.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InviteCode } from './entities/invite-code.entity';
import { InviteCodeService } from './invite-code.service';
import { InviteCodeController } from './invite-code.controller';
import { InviteCodeFactory } from './invite-code.factory';

@Module({
  imports: [TypeOrmModule.forFeature([InviteCode])],
  providers: [InviteCodeService, InviteCodeFactory],
  controllers: [InviteCodeController],
  exports: [InviteCodeService],
})
export class InviteCodeModule {}
