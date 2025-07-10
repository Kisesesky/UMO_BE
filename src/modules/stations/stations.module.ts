// src/stations/stations.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationsService } from './stations.service';
import { StationsController } from './stations.controller';
import { Station } from './entities/station.entity';
import { UmbrellasModule } from 'src/modules/umbrellas/umbrellas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Station]),
    UmbrellasModule,
  ],
  controllers: [StationsController],
  providers: [StationsService],
  exports: [StationsService],
})
export class StationsModule {}
