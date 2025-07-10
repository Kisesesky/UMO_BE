// src/common/logs/audit-logger.service.ts
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class AuditLogger {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  log(action: string, meta: Record<string, any>) {
    this.logger.log({ message: action, meta });
  }

  warn(action: string, meta: Record<string, any>) {
    this.logger.warn({ message: action, meta });
  }

  error(action: string, meta: Record<string, any>) {
    this.logger.error({ message: action, meta });
  }
}
