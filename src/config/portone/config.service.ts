//src/config/portone/config.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PortOneConfigService {
  constructor(private configService: ConfigService) {}

  get portoneCode() {
    return this.configService.get<string>('portone.portoneCode');
  }

  get portoneApiKey() {
    return this.configService.get<string>('portone.portoneApiKey');
  }

  get portoneApiSecret() {
    return this.configService.get<string>('portone.portoneApiSecret');
  }
}
