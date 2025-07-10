// test/rental.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RENTAL_STATUS } from '../src/common/constants/rental-status';
import { UMBRELLA_STATUS } from '../src/common/constants/umbrella-status';
import { UsersModule } from 'src/modules/users/users.module';
import { RentalsModule } from 'src/modules/rentals/rentals.module';
import { UmbrellasModule } from 'src/modules/umbrellas/umbrellas.module';
import { StationsModule } from 'src/modules/stations/stations.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { WalletsModule } from 'src/modules/wallets/wallets.module';

describe('Rental Flow (e2e)', () => {
  let app: INestApplication;
  let userId: number;
  let umbrellaId: number;
  let rentalId: number;
  let authToken: string;
  let stationId: number;

  beforeAll(async () => {
    // 테스트용 모듈 생성
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        // AppModule 대신 필요한 모듈만 직접 임포트
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [__dirname + '/../src/**/*.entity{.ts,.js}'], // 경로 수정
          synchronize: true,
          dropSchema: true, // 스키마 초기화 추가
        }),
        UsersModule,
        UmbrellasModule,
        RentalsModule,
        WalletsModule,
        StationsModule,
        AuthModule,
      ],
      // SeedModule은 제외하거나 모킹
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // 테스트 데이터 준비
    // 1. 사용자 등록
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: '테스트 사용자',
        email: 'test@example.com',
        password: 'Password123!'
      });
    
    userId = registerResponse.body.id;
    
    // 2. 로그인
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Password123!'
      });
    
    authToken = loginResponse.body.accessToken;
    
    // 3. 지갑에 잔액 충전
    await request(app.getHttpServer())
      .post(`/wallets/user/${userId}/deposit`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ amount: 20000 });
    
    // 4. 대여소 생성
    const stationResponse = await request(app.getHttpServer())
      .post('/stations')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: '테스트 대여소',
        address: '서울시 강남구',
        latitude: 37.498095,
        longitude: 127.027610
      });
    
    stationId = stationResponse.body.id;
    
    // 5. 우산 생성
    const umbrellaResponse = await request(app.getHttpServer())
      .post('/umbrellas')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        code: 'TEST-001',
        price: 15000,
        rentalFeePerHour: 1000,
        stationId
      });
    
    umbrellaId = umbrellaResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('전체 대여 프로세스 테스트', async () => {
    // 1. 우산 대여 요청
    const rentalResponse = await request(app.getHttpServer())
      .post('/rentals/rent')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        userId,
        umbrellaId
      });
    
    expect(rentalResponse.status).toBe(201);
    expect(rentalResponse.body.status).toBe(RENTAL_STATUS.PENDING);
    rentalId = rentalResponse.body.id;
    
    // 2. 대여 확정
    const confirmResponse = await request(app.getHttpServer())
      .post(`/rentals/${rentalId}/confirm`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(confirmResponse.status).toBe(200);
    expect(confirmResponse.body.status).toBe(RENTAL_STATUS.RENTED);
    
    // 3. 우산 상태 확인
    const umbrellaResponse = await request(app.getHttpServer())
      .get(`/umbrellas/${umbrellaId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(umbrellaResponse.status).toBe(200);
    expect(umbrellaResponse.body.status).toBe(UMBRELLA_STATUS.RENTED);
    
    // 4. 우산 반납
    const returnResponse = await request(app.getHttpServer())
      .put(`/rentals/${rentalId}/return`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        stationId
      });
    
    expect(returnResponse.status).toBe(200);
    expect(returnResponse.body.status).toBe(RENTAL_STATUS.RETURNED);
    expect(returnResponse.body.totalFee).toBeDefined();
    
    // 5. 반납 후 우산 상태 확인
    const umbrellaAfterReturnResponse = await request(app.getHttpServer())
      .get(`/umbrellas/${umbrellaId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(umbrellaAfterReturnResponse.status).toBe(200);
    expect(umbrellaAfterReturnResponse.body.status).toBe(UMBRELLA_STATUS.AVAILABLE);
    
    // 6. 지갑 잔액 확인 (요금이 차감되었는지)
    const walletResponse = await request(app.getHttpServer())
      .get(`/wallets/user/${userId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(walletResponse.status).toBe(200);
    expect(walletResponse.body.balance).toBeLessThan(20000); // 요금이 차감되었는지 확인
  });

  it('잔액 부족 시 대여 실패 테스트', async () => {
    // 1. 잔액 0으로 설정
    await request(app.getHttpServer())
      .post(`/wallets/user/${userId}/withdraw`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ amount: 20000 }); // 모든 잔액 인출
    
    // 2. 우산 대여 시도
    const rentalResponse = await request(app.getHttpServer())
      .post('/rentals/rent')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        userId,
        umbrellaId
      });
    
    // 3. 잔액 부족으로 대여 실패 확인
    expect(rentalResponse.status).toBe(400);
  });
});
