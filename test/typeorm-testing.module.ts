// test/helpers/typeorm-testing.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';

export const TypeOrmSQLITETestingModule = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    entities: [__dirname + '/../../src/**/*.entity{.ts,.js}'],
    synchronize: true,
    dropSchema: true,
  }),
];
