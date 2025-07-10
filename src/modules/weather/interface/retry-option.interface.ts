// src/modules/weather/interface/retry-option.interface.ts
export interface RetryOptions {
  retries?: number;          // 최대 재시도 횟수, 기본 3회
  delayMs?: number;          // 초기 대기시간(ms), 기본 1000ms
  maxDelayMs?: number;       // 최대 대기시간(ms), 기본 30000ms
  backoffFactor?: number;    // 백오프 증가 배수, 기본 2
  retryableErrors?: (err: any) => boolean;  // 재시도 여부 판단 함수
  onRetry?: (attempt: number, error: any) => void;  // 재시도 시 호출 콜백
}
