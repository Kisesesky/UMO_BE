# UMO (Umbrella Moment) Backend

# ☂️ UMO - Urban Umbrella Mobility

[![Node.js Version](https://img.shields.io/badge/node-18.x-brightgreen.svg)](https://nodejs.org/en/)
[![NestJS Version](https://img.shields.io/badge/nestjs-^11.0.0-red.svg)](https://nestjs.com/)
[![TypeScript Version](https://img.shields.io/badge/typescript-^5.7.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-UNLICENSED-lightgrey.svg)](./LICENSE)

![UMO Face](./assets/character/umo-face2.png)

> **비 오는 날, 우산은 우모가 챙길게.**

UMO는 도시 속 사용자들이 비를 걱정하지 않고 자유롭게 이동할 수 있도록 도와주는 **스마트 공유 우산 서비스**입니다. 고양이 마스코트 **우모(Umo)** 가 언제 어디서든 우산을 안내하고, 공유할 수 있도록 도와줍니다.

---

## 🐱 소개

![UMO](./assets/character/umo-body.png)

UMO는 우산을 필요한 순간에 대여하고, 자유롭게 반납할 수 있는 **도시형 공유 우산 플랫폼**입니다.  
마스코트인 **우모(Umo)** 는 사용자에게 귀엽고 신뢰감 있는 가이드 역할을 하며, 비 오는 날 당신의 곁을 지켜줍니다.

## 📚 목차

- [프로젝트 개요](#-프로젝트-개요)
- [기술 스택](#-기술-스택)
- [프로젝트 구조](#-프로젝트-구조)
- [설치 및 실행](#-설치-및-실행)
- [API 문서](#-api-문서)
- [개발 가이드](#-개발-가이드)
- [CI/CD & 배포](#-CI/CD & 배포)

## 🎯 프로젝트 개요

UMO는 실시간 우산 대여 서비스로, 다음과 같은 주요 기능을 제공합니다:

- 실시간 우산 대여/반납 시스템
- 위치 기반 스테이션 관리
- 구독 기반 멤버십 서비스
- 날씨 정보 연동
- 전자 지갑 시스템

## 🛠 기술 스택

### Core

- NestJS
- TypeScript
- Node.js

### Database & Cache

- PostgreSQL
- TypeORM
- Redis

### Authentication

- JWT (JSON Web Tokens)
- Passport.js

### Real-time Features

- Socket.IO
- WebSocket

### Payment

- PortOne (구 아임포트)

### External APIs

- 기상청 날씨 API

## 📁 프로젝트 구조

```
.gemini                                         # gemini role
  └── setting.json                              #   └── setting.json
.github                                         # github action
  └── workflows/                                #   └── workflows
        └── docker-publish.yml                  #         └── docker-hub
assets/                                         # img파일
scripts                                         # Scripts파일
  └── wait-for-it.sh                            #   └── migration rating scrits           
src/
├── common/                                     # 공통 컴포넌트
│   ├── constants/                              # 상수 정의
│   │   ├── region-mappings.ts
│   │   └── register-status.ts
│   ├── decorators/                             # 커스텀 데코레이터
│   │   ├── public.decorator.ts
│   │   ├── request-origin.decorator.ts
│   │   ├── request-user.decorator.ts
│   │   └── roles.decorator.ts
│   ├── dto/                                    # 공통 DTO
│   │   ├── base-response.dto.ts
│   │   ├── base-weather-response.dto.ts
│   │   ├── error-response.dto.ts
│   │   └── success-response.dto.ts
│   ├── entities/                               # 공통 엔티티
│   │   ├── base-weather.entity.ts
│   │   └── base.entity.ts
│   ├── filters/                                # 필터
│   │   └── all-exceptions.filter.ts            #   └── 전체 예외 전역 처리
│   ├── guards/                                 # 보안 가드
│   │   └── roles.guard.ts                      #   └── RoleGuard
│   ├── logs/                                   # logs
│   │   ├── audit-logger.service.ts             #   ├── audit.logger
│   │   └── winston.config.ts                   #   └── Winston
│   ├── sentry/                                 # sentry
│   │   ├── sentry-util.ts
│   │   └── sentry.config.ts
│   ├── utils/                                  # 유틸리티
│   │   ├── cookie-util.ts                      #   ├── Cookie Util
│   │   ├── password-util.ts                    #   ├── Password Util
│   │   ├── request-util.ts                     #   ├── Request Util
│   │   └── time-util.ts                        #   └── Time Util
│   └── validators/                             # 유효성 검사
│       └── password-validator.ts               #   └── Password Validator
│
├── config/                                     # 환경 설정
│   ├── app/                                    #   ├── 앱 설정
│   ├── db/                                     #   ├── 데이터베이스 설정
│   ├── gcs/                                    #   ├── GCS 설정
│   ├── portone/                                #   ├── 결제 설정
│   ├── redis/                                  #   ├── Redis 설정
│   ├── social/                                 #   ├── 소셜 로그인 설정
│   └── weather/                                #   └── 날씨 API 설정
│
├── database/                                   # 데이터베이스
│   ├── migrations/                             #   ├── 마이그레이션
│   └── data-source.ts                          #   └── 데이터소스 설정
│
├── docs/                                       # 문서
│   └── swagger/                                #   ├── swagger
│      └── swagger-spec.json                    #   └── swagger.json
│
├── modules/                                    
│   ├── admin/                                  # 관리자 모듈
│   │   ├── constants/
│   │   ├── decorators/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── exceptions/
│   │   ├── guards/
│   │   ├── logs/
│   │   ├── messages/
│   │   ├── notifications/
│   │   ├── orders/
│   │   ├── service/
│   │   ├── stat/       
│   │   ├── admin.controller.ts
│   │   └── admin.module.ts      
│   │ 
│   ├── auth/                                   # 인증 모듈
│   │   ├── controllers/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── guards/
│   │   ├── service/
│   │   ├── strategies/
│   │   ├── templates/                          # 이메일 템플릿
│   │   └── auth.module.ts       
│   │
│   ├── database/                               # DB 모듈
│   │   └── database.module.ts       
│   │
│   ├── gcs/                                    # gcs 모듈
│   │   ├── gcs.controller.ts
│   │   ├── gcs.module.ts
│   │   └── gcs.service.ts       
│   │     
│   ├── invites/                                # 초대 모듈
│   │   ├── config/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── invite-code.controller.ts
│   │   ├── invite-code.fcatory.ts
│   │   ├── invite-code.module.ts
│   │   └── invite-code.service.ts       
│   │     
│   ├── locations/                              # 위치 모듈
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── locations.controller.ts
│   │   ├── locations.module.ts
│   │   └── locations.service.ts       
│   │     
│   ├── notification/                           # 알림 모듈
│   │   ├── constants/
│   │   ├── dto/
│   │   ├── notification.module.ts
│   │   ├── notification.scheduler.ts
│   │   └── notification.service.ts       
│   │     
│   ├── orders/                                 # 주문 모듈
│   │   ├── constants/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── exceptions/
│   │   ├── messages/
│   │   ├── orders.controller.ts
│   │   ├── orders.module.ts
│   │   └── orders.service.ts       
│   │     
│   ├── payments/                               # 결제 모듈
│   │   ├── dto/     
│   │   ├── exceptions/
│   │   ├── messages/
│   │   ├── payments.controller.ts
│   │   ├── payments.module.ts
│   │   └── payments.service.ts       
│   │     
│   ├── products/                               # 상품 모듈
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── types/
│   │   ├── products.controller.ts
│   │   ├── products.module.ts
│   │   └── products.service.ts 
│   │    
│   ├── redis/                                  # Redis 모듈
│   │   └── redis.module.ts       
│   │
│   ├── referrals/                              # 보상 확인
│   │   ├── constants/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── referrals.controller.ts
│   │   ├── referrals.module.ts
│   │   └── referrals.service.ts 
│   │
│   ├── rentals/                                # 대여 모듈
│   │   ├── constants/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── exceptions/
│   │   ├── messages/
│   │   ├── rentals.controller.ts
│   │   ├── rentals.module.ts
│   │   └── rentals.service.ts 
│   │
│   ├── rewards/                                # 보상
│   │   ├── constants/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── rewards.controller.ts
│   │   ├── rewards.module.ts
│   │   └── rewards.service.ts 
│   │
│   ├── seed/                                   # 데이터 시딩
│   │   ├── data/
│   │   ├── seed.module.ts
│   │   └── seed.service.ts 
│   │         
│   ├── stations/                               # 스테이션 모듈
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── exceptions/
│   │   ├── messages/
│   │   ├── stations.controller.ts
│   │   ├── stations.module.ts
│   │   └── stations.service.ts 
│   │
│   ├── subscriptions/                          # 구독 모듈
│   │   ├── constants/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── subscriptions.controller.ts
│   │   ├── subscriptions.module.ts
│   │   ├── subscriptions.scheduler.ts
│   │   └── subscriptions.service.ts 
│   │
│   ├── support/                                # 서포터 모듈
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── support.controller.ts
│   │   ├── support.module.ts
│   │   └── support.service.ts 
│   │
│   ├── throttler/                              # throttler 모듈
│   │   └── throttler.module.ts       
│   │
│   ├── umbrellas/                              # 우산 모듈
│   │   ├── constants/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── exceptions/
│   │   ├── messages/
│   │   ├── umbrellas.controller.ts
│   │   ├── umbrellas.module.ts
│   │   └── umbrellas.service.ts 
│   │
│   ├── users/                                  # 사용자 모듈
│   │   ├── constants/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── exceptions/
│   │   ├── messages/
│   │   ├── subscribers/
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts 
│   │   
│   ├── wallets/                                # 지갑 모듈
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── exceptions/
│   │   ├── messages/
│   │   ├── types/
│   │   ├── wallet-logs/
│   │   │    ├── dto/
│   │   │    └── entities/
│   │   ├── wallets.controller.ts
│   │   ├── wallets.module.ts
│   │   └── wallets.service.ts 
│   │   
│   ├── weather/                                # 날씨 모듈
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── exceptions/
│   │   ├── interface/
│   │   ├── mappers/
│   │   ├── messages/
│   │   ├── processors/
│   │   ├── region/
│   │   ├── service/
│   │   ├── utils/    
│   │   ├── weather.controller.ts
│   │   ├── weather.module.ts
│   │   └── weather.scheduler.ts
│   │   
│   └── websocket/                              # 웹소켓 모듈
│       ├── dto/
│       ├── events/
│       ├── websocket.gateway.ts
│       ├── websocket.module.ts
│       └── websocket.service.ts
│
│
├── app.controller.ts                           # 앱 컨트롤러
├── app.module.ts                               # 루트 모듈
├── app.service.ts                              # 앱 서비스
└── main.ts                                     # 애플리케이션 진입점
```

## ⚙️ 설치 및 실행

### 필수 요구사항

- Node.js >= 18.x
- npm >= 9.x
- PostgreSQL >= 16.x
- Redis >= 7.x

### 설치

```bash
# 저장소 클론
git clone [repository-url]

# 의존성 설치
npm install --legacy-peer-deps

# 환경 변수 설정
cp .env.example .env
```

### 실행

```bash
# 개발 모드
npm run start:dev

# 마이그레이션 생성
npm run migration:generate -- src/database/migrations/[MigrationName]

# 마이그레이션 실행
npm run migration:run

# 마이그레이션 되돌리기
npm run migration:revert

# 프로덕션 모드
npm run start:prod
```

## 📚 API 문서

- Swagger UI: `http://localhost:3000/api-docs`, `http://localhost:3000/docs`
- API 엔드포인트 문서화 완료

## 📦 CI/CD

GitHub Actions를 통해 다음을 자동화합니다:

- dev 브랜치 푸시 → DockerHub 이미지 빌드 & 푸시
- 경로: `.github/workflows/docker-publish.yml`
- docker image build: [userid]/umo:latest
- DockerHub에 로그인 및 푸시

## 🧪 테스트

```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 테스트 커버리지
npm run test:cov
```

## 📝 주요 모듈 설명

### Auth Module

- JWT 기반 인증
- 소셜 로그인 (구글, 카카오)
- 권한 관리

### Rental Module

- 실시간 우산 대여/반납
- QR 코드 스캔 처리
- 대여 이력 관리

### Station Module

- 스테이션 위치 관리
- 실시간 재고 현황
- 근처 스테이션 검색

### Payment Module

- 포트원 결제 연동
- 결제 웹훅 처리
- 환불 프로세스

### Weather Module

- 실시간 날씨 정보
- 강수 확률 예측
- 위치 기반 날씨 알림

## 🤝 기여 가이드

1. 이슈 생성
2. 브랜치 생성 (`feature/기능명` 또는 `fix/버그명`)
3. 변경사항 커밋
4. PR 생성

### 커밋 컨벤션

```
feat: 새로운 기능
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드 업무 수정
```

## 📝 라이선스

MIT License

[node-version-shield]: https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen
[nestjs-version-shield]: https://img.shields.io/badge/nestjs-%3E%3D%2011.0.0-red
[typescript-version-shield]: https://img.shields.io/badge/typescript-%3E%3D%205.0.0-blue
[license-shield]: https://img.shields.io/badge/license-MIT-green
