//src/config/gcs/config.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GcsConfigService {
  constructor(private configService: ConfigService) {}

  get gcsKeyFile() {
    return this.configService.get<string>('gcs.gcsKeyFile');
  }

  get gcsBucketName() {
    return this.configService.get<string>('gcs.gcsBucketName');
  }

  get gcsProjectId() {
    return this.configService.get<string>('gcs.gcsProjectId');
  }
}
