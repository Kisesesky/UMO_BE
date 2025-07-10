//./../../rentals/rental.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalsController } from './rentals.controller';
import { RentalsService } from './rentals.service';
import { Rental } from './entities/rental.entity';
import { UsersModule } from '../users/users.module';
import { WalletsModule } from 'src/modules/wallets/wallets.module';
import { UmbrellasModule } from '../umbrellas/umbrellas.module';
import { WebsocketModule } from '../websocket/websocket.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rental]),
    UsersModule,
    UmbrellasModule,
    WalletsModule,
    WebsocketModule,
    SubscriptionsModule,
  ],
  controllers: [RentalsController],
  providers: [RentalsService],
  exports: [RentalsService],
})
export class RentalsModule {}
