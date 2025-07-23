import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { WalletsModule } from 'src/modules/wallets/wallets.module';
import { InviteCodeModule } from '../invites/invite-code.module';
import { GcsModule } from 'src/modules/gcs/gcs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    WalletsModule,
    InviteCodeModule,
    GcsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
