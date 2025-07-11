// src/modules/redis/redis.module.ts
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get('REDIS_HOST');
        const port = Number(configService.get('REDIS_PORT'));
        const password = configService.get('REDIS_PASSWORD');
        const ttl = Number(configService.get('REDIS_TTL'));
        const max = Number(configService.get('REDIS_MAX'));
        return {
          store: redisStore,
          host,
          port,
          password,
          ttl,
          max,
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [CacheModule],
})
export class RedisModule {}
