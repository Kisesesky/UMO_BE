// src/common/utils/time-util.ts (새로운 유틸리티 파일 생성)
import { Logger } from '@nestjs/common';

const logger = new Logger('TimeUtil');

export class TimeUtil {
  /**
   * '1h', '30d'와 같은 문자열을 밀리초(ms) 단위로 변환합니다.
   * 지원되는 단위: s (초), m (분), h (시간), d (일)
   * @param expiresInString '1h', '30d'와 같은 만료 시간 문자열
   * @returns 밀리초 단위의 시간
   */
  static convertExpiresInToMs(expiresInString: string): number {
    const value = parseInt(expiresInString.slice(0, -1)); // 숫자 부분 추출
    const unit = expiresInString.slice(-1); // 단위 부분 추출

    if (isNaN(value)) {
      logger.warn(`Invalid expiresIn string format: ${expiresInString}. Returning 0.`);
      return 0;
    }

    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        logger.warn(`Unsupported time unit: ${unit} in ${expiresInString}. Returning 0.`);
        return 0;
    }
  }
}