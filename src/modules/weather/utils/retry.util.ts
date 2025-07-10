// src/common/utils/retry.util.ts
import { Logger } from '@nestjs/common';
import { RetryOptions } from '../interface/retry-option.interface';

const logger = new Logger('RetryUtil');

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const {
    retries = 3,
    delayMs = 1000,
    maxDelayMs = 30000,
    backoffFactor = 2,
    retryableErrors,
    onRetry,
  } = options;

  let attempt = 0;
  let currentDelay = delayMs;
  let lastError: any;

  while (attempt < retries) {
    try {
      attempt++;
      return await fn();
    } catch (err) {
      lastError = err;
      const shouldRetry = retryableErrors ? retryableErrors(err) : true;

      if (!shouldRetry) {
        logger.warn(`Error is not retryable: ${err.message || err}`);
        throw err;
      }

      logger.warn(`Attempt ${attempt} failed: ${err.message || err}`);

      if (onRetry) {
        try {
          onRetry(attempt, err);
        } catch (callbackErr) {
          logger.error(`onRetry callback error: ${callbackErr.message || callbackErr}`);
        }
      }

      if (attempt >= retries) break;

      await new Promise(res => setTimeout(res, currentDelay));
      currentDelay = Math.min(currentDelay * backoffFactor, maxDelayMs);
    }
  }

  logger.error(`All ${retries} retry attempts failed.`);
  throw lastError;
}
