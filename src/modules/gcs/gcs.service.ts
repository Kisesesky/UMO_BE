// src/modules/gcs/gcs.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { GcsConfigService } from 'src/config/gcs/config.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GcsService {
  private readonly logger = new Logger(GcsService.name);
  private storage: Storage;
  private bucketName: string;

  constructor(private readonly gcsConfig: GcsConfigService) {
    this.storage = new Storage({
      projectId: this.gcsConfig.gcsProjectId!,
      keyFilename: this.gcsConfig.gcsKeyFile!,
    });
    this.bucketName = this.gcsConfig.gcsBucketName!;
  }

  async uploadFile(file: Express.Multer.File, destination?: string) {
    try {
      const fileName = destination || `profile/${Date.now()}_${uuidv4()}_${file.originalname}`;
      const bucket = this.storage.bucket(this.bucketName);
      const gcsFile = bucket.file(fileName);

      await gcsFile.save(file.buffer, {
        contentType: file.mimetype,
      });

      return `https://storage.googleapis.com/${this.bucketName}/${gcsFile.name}`;
    } catch (error) {
      this.logger.error('GCS 파일 업로드 실패', error.stack || error);
      // 정책에 따라 예외 throw 또는 기본 이미지 반환
      return 'assets/character/umo-face2.png';
    }
  }
}
