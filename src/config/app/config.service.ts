//src/config/app/config.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  jwtService: string | Buffer | undefined;
  constructor(private configService: ConfigService) {}

  get jwtSecret() {
    return this.configService.get<string>('app.jwtSecret');
  }

  get jwtRefreshSecret() {
    return this.configService.get<string>('app.jwtRefreshSecret');
  }

  get accessExpiresIn(): string {
    return this.configService.get<string>('app.accessExpiresIn') || '1h';
  }

  get jwtRefreshExpiresIn(): string {
    return this.configService.get<string>('app.jwtRefreshExpiresIn') || '30d';
  }

  get port():number {
    return this.configService.get<number>('app.port') ?? 3000;
  }

  get frontendUrl(): string {
    return this.configService.get<string>('app.frontendUrl') || '';
  }

  get gmailUser() {
    return this.configService.get<string>('app.gmailUser');
  }

  get gmailPass() {
    return this.configService.get<string>('app.gmailPass');
  }
}
