// src/modules/throttler/throttler.module.ts
import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60_000, // 밀리초 단위 (1분)
          limit: 10,
        },
      ],
    }),
  ],
  exports: [ThrottlerModule],
})
export class ThrottlerConfigModule {}
