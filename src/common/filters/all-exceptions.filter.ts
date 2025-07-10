// src/common/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';
import { ErrorResponseDto } from '../dto/error-response.dto';
import { AuditLogger } from '../logs/audit-logger.service';
import * as Sentry from '@sentry/node';

@Catch() // 모든 예외를 잡음
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly auditLogger: AuditLogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    let httpStatus: HttpStatus;
    let errorMessage: string | string[];
    let errorName: string; // HTTP 에러 이름 (예: Bad Request, Not Found)
    let errorCode: string | undefined; // 내부 에러 코드 (예: USER_001)
    let errorDetails: Record<string, any> | undefined; // 유효성 검사 오류 등 상세 정보

    // 1. HttpException (NestJS 내장 또는 우리가 정의한 커스텀 HttpException)
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const responseException = exception.getResponse(); // HttpException에 담긴 응답 객체
      
      if (typeof responseException === 'string') {
        errorMessage = responseException;
        errorName = HttpStatus[httpStatus]; // HTTP 상태 이름
      } else {
        // ValidationPipe 등으로 인한 BadRequestException의 경우 message가 배열일 수 있음
        errorMessage = (responseException as any).message || HttpStatus[httpStatus];
        errorName = (responseException as any).error || HttpStatus[httpStatus];
        errorDetails = (responseException as any).details || undefined; // 상세 정보 가져오기
        errorCode = (responseException as any).code || undefined; // 커스텀 에러 코드 가져오기
      }
      this.logger.warn(`HTTP Exception (${httpStatus}): ${errorMessage} - Path: ${request.url}`);
    } 
    // 2. QueryFailedError (TypeORM 데이터베이스 에러)
    else if (exception instanceof QueryFailedError) {
      httpStatus = HttpStatus.BAD_REQUEST; // DB 관련 에러는 보통 400
      errorMessage = '데이터베이스 오류가 발생했습니다.';
      errorName = 'Database Error';
      errorCode = 'DB_QUERY_FAILED';
      this.logger.error(`QueryFailedError: ${exception.message} - Path: ${request.url}`, exception.stack);
    }
    // 3. 그 외 모든 예상치 못한 에러
    else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = '예상치 못한 서버 오류가 발생했습니다.';
      errorName = 'Internal Server Error';
      errorCode = 'UNEXPECTED_ERROR';
      // 예상치 못한 에러는 상세 로그를 남김 (스택 트레이스 포함)
      this.logger.error(
        `Unhandled Exception: ${
          exception instanceof Error ? exception.message : JSON.stringify(exception)
        } - Path: ${request.url}`, 
        exception instanceof Error ? exception.stack : undefined
      );
    }

    // 요청자 정보(선택적으로 감사 로그에 활용)
    const userId = request.user?.id || request.user?.userId || null;
    const userRole = request.user?.role || null;

    // 유저 정보 세팅 (전역 컨텍스트에 저장)
    Sentry.setUser({
      id: userId ? String(userId) : undefined,
      role: userRole,
      ip_address: request.ip,
    });

    // Sentry 전술
    Sentry.captureException(exception, {
      extra: {
        method: request.method,
        url: request.url,
        body: request.body,
        query: request.query,
        params: request.params,
      },
    });

    // 커스텀 감사 로그 기록
    this.auditLogger?.log('EXCEPTION', {
      status: httpStatus,
      error: errorName,
      message: errorMessage,
      path: request.url,
      userId,
      userRole,
      method: request.method,
      ip: request.ip,
    });

    const responseBody: ErrorResponseDto = {
      statusCode: httpStatus,
      error: errorName,
      message: errorMessage,
      path: httpAdapter.getRequestUrl(request),
      timestamp: new Date().toISOString(),
      ...(errorCode && { code: errorCode }),
      ...(errorDetails && { details: errorDetails }),
    };

    httpAdapter.reply(response, responseBody, httpStatus);
  }
}