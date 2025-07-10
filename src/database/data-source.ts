// src/database/data-source.ts
import * as dotenv from 'dotenv';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

// .env 파일 로드: data-source.ts가 src/database에 있으므로,
// .env 파일은 프로젝트 루트에 있을 테니, '../..'를 사용해서 루트로 이동 후 .env를 찾음
dotenv.config({ path: join(__dirname, '../../.env') }); 

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [join(__dirname, '../modules/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, './migrations/**/*{.ts,.js}')], 
  subscribers: [join(__dirname, '../modules/**/subscribers/*.subscriber{.ts,.js}')],
  synchronize: false, // 운영 환경에서는 항상 false
  extra: {
    options: '-c timezone=Asia/Seoul'
  }
};

export const AppDataSource = new DataSource(dataSourceOptions);