// src/common/utils/request-util.ts
import { Request } from 'express';

export function getClientIp(request: Request): string {
  const xForwardedFor = request.headers['x-forwarded-for'];
  if (typeof xForwardedFor === 'string') {
    return xForwardedFor.split(',')[0].trim();
  }
  return request.ip || '';
}

export function getUserAgent(request: Request): string {
  return typeof request.headers['user-agent'] === 'string'
    ? request.headers['user-agent']
    : '';
}
