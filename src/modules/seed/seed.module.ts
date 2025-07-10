// src/modules/seed/seed.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { UsersModule } from '../users/users.module';
import { StationsModule } from '../stations/stations.module';
import { UmbrellasModule } from '../umbrellas/umbrellas.module';
import { ProductsModule } from '../products/products.module';
import { WalletsModule } from '../wallets/wallets.module';
import { User } from '../users/entities/user.entity';
import { Station } from '../stations/entities/station.entity';
import { Umbrella } from '../umbrellas/entities/umbrella.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Station, Umbrella, Product]),
    UsersModule,
    StationsModule,
    UmbrellasModule,
    ProductsModule,
    WalletsModule,
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}