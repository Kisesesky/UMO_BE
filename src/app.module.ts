//src/app.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditLogger } from './common/logs/audit-logger.service';
import { SocialConfigModule } from './config/social/config.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { NotificationModule } from './modules/notification/notification.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ProductsModule } from './modules/products/products.module';
import { RedisModule } from './modules/redis/redis.module';
import { RentalsModule } from './modules/rentals/rentals.module';
import { SeedModule } from './modules/seed/seed.module';
import { StationsModule } from './modules/stations/stations.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { SupportModule } from './modules/support/support.module';
import { ThrottlerConfigModule } from './modules/throttler/throttler.module';
import { UmbrellasModule } from './modules/umbrellas/umbrellas.module';
import { UsersModule } from './modules/users/users.module';
import { WalletsModule } from './modules/wallets/wallets.module';
import { WeatherModule } from './modules/weather/weather.module';
import { WebsocketModule } from './modules/websocket/websocket.module';

@Module({
  imports: [
    DatabaseModule,
    UmbrellasModule,
    UsersModule,
    RentalsModule,
    SeedModule,
    StationsModule,
    WalletsModule,
    AuthModule,
    WebsocketModule,
    PaymentsModule,
    WeatherModule,
    NotificationModule,
    ProductsModule,
    OrdersModule,
    SubscriptionsModule,
    SocialConfigModule,
    AdminModule,
    SupportModule,
    RedisModule,
    ThrottlerConfigModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuditLogger,
    {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
