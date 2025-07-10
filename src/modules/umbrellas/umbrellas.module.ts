import { Module } from '@nestjs/common';
import { UmbrellasService } from './umbrellas.service';
import { UmbrellasController } from './umbrellas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Umbrella } from './entities/umbrella.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Umbrella])],
  controllers: [UmbrellasController],
  providers: [UmbrellasService],
  exports: [UmbrellasService],
})
export class UmbrellasModule {}
