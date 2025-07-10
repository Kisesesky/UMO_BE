// src/common/sentry/sentry-util.ts
import * as Sentry from '@sentry/node';

export function captureExceptionWithContext(exception: unknown, context?: Record<string, any>) {
  Sentry.captureException(exception, {
    extra: context,
  });
}
