import { Module } from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { ReferralsController } from './referrals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Referral } from './entities/referral.entity';
import { User } from '../users/entities/user.entity';
import { InviteCode } from '../invites/entities/invite-code.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Referral, 
      User, 
      InviteCode
    ]),
  ],
  controllers: [ReferralsController],
  providers: [ReferralsService],
  exports: [ReferralsService],
})
export class ReferralsModule {}
