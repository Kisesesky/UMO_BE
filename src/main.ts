// src/main.ts
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { json } from 'express';
import * as expressBasicAuth from 'express-basic-auth';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { AuditLogger } from './common/logs/audit-logger.service';
import { initSentry } from './common/sentry/sentry.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.use(cookieParser());
  app.use(json());

  // Sentry 초기화
  initSentry();

  // 전역 예외 필터 등록
  // app.get(HttpAdapterHost)를 통해 HttpAdapterHost 객체 자체를 가져옴
  const httpAdapterHost = app.get(HttpAdapterHost);
  const auditLogger = app.get(AuditLogger);

  // 유효성 검사 파이프 적용
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 속성 자동 제거
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성 발견 시 에러 발생
      transform: true, // DTO 타입으로 자동 변환 (쿼리 파라미터 등)
      transformOptions: {
        enableImplicitConversion: true, // 암시적 타입 변환 허용 (string to number 등)
      },
    }),
  );
  
  // 전역 예외 필터는 통합된 AllExceptionsFilter만 등록
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost, auditLogger));

  // API 접두사 설정
  app.setGlobalPrefix('api/v1', {
    exclude: ['health'],
  });

  //CORS 설정 - 개발용
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.use(
    ['/docs', '/docs-json'], // 스웨거 UI와 JSON 문서 경로
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER || 'swagger']:
          process.env.SWAGGER_PASSWORD || 'swagger123',
      },
    }),
  );

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('우모 서비스 API 문서')
    .setDescription('우산 대여 서비스 백엔드 API 문서입니다.')
    .setVersion('1.0') // API 버전 명시
    .addTag('auth', '인증 및 사용자 관련 API') // 태그 추가 및 설명
    .addTag('users', '사용자 정보 관리 API')
    .addTag('wallets', '지갑 및 화폐 관리 API')
    .addTag('products', '상품 (이용권, MD 등) 관리 API')
    .addTag('orders', '상품 주문 및 구매 API')
    .addTag('subscriptions', '이용권 관리 API')
    .addTag('stations', '대여소 관리 API')
    .addTag('umbrellas', '우산 관리 API')
    .addTag('rentals', '우산 대여 및 반납 API')
    .addTag('payments', '결제 시스템 연동 API')
    .addTag('weather', '날씨 정보 조회 API')
    .addBearerAuth(
      // JWT 인증 설정
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'JWT 토큰을 입력하세요. (Bearer {token})',
        in: 'header',
      },
      'JWT-auth', // 이 이름을 @ApiBearerAuth() 데코레이터에 사용
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha', // 태그를 알파벳 순으로 정렬 (기본값)
      operationsSorter: 'alpha', // 오퍼레이션을 알파벳 순으로 정렬 (기본값)
      persistAuthorization: true, // 인증 토큰을 새로고침해도 유지
    },
  });

  // Swagger JSON 파일로 저장
  const fs = require('fs');
  fs.writeFileSync(
    './src/docs/swagger/swagger-spec.json',
    JSON.stringify(document),
  );

  const port = process.env.PORT || 8080;
  await app.listen(port);
}
bootstrap();
