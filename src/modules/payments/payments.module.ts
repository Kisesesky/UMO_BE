// src/modules/payments/payments.module.ts
import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { WalletsModule } from '../wallets/wallets.module';
import { HttpModule } from '@nestjs/axios';
import { PortOneConfigModule } from 'src/config/portone/config.module';

@Module({
  imports: [
    WalletsModule,
    HttpModule,
    PortOneConfigModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}