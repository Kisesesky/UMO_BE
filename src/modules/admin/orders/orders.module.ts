import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AdminOrdersController } from './orders.controller';

@Module({
  controllers: [AdminOrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
