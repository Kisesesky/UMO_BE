// src/modules/seed/seed.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UsersService } from '../users/users.service';
import { StationsService } from '../stations/stations.service';
import { UmbrellasService } from '../umbrellas/umbrellas.service';
import { ProductsService } from '../products/products.service';
import { WalletsService } from '../wallets/wallets.service';
import { USERS_SEED_DATA } from './data/users.data';
import { STATIONS_SEED_DATA } from './data/stations.data';
import { UMBRELLAS_SEED_DATA } from './data/umbrellas.data';
import { PRODUCTS_SEED_DATA } from './data/products.data';
import { User } from '../users/entities/user.entity';
import { Station } from '../stations/entities/station.entity';
import { Umbrella } from '../umbrellas/entities/umbrella.entity';
import { Product } from '../products/entities/product.entity';
import * as fs from 'fs';
import * as path from 'path';
import { ADMINS_SEED_DATA } from './data/admins.data';
import { Admin } from '../admin/entities/admin.entity';
import { AdminService } from '../admin/services/admin.service';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly usersService: UsersService,
    private readonly stationsService: StationsService,
    private readonly umbrellasService: UmbrellasService,
    private readonly productsService: ProductsService,
    private readonly walletsService: WalletsService,
    private readonly adminsService: AdminService,
  ) {}

  async onModuleInit() {
    // 운영 환경에서는 시딩을 실행하지 않도록 방지
    if (process.env.NODE_ENV === 'production') {
      this.logger.warn('🚫 Seeding is disabled in production environment.');
      return;
    }

    this.logger.log('🚀 Starting data seeding...');
    
    // 시딩 순서 중요: User -> Station -> Product -> Umbrella
    try {
      await this.seedUsers();
    } catch (error) {
      this.logger.error(`❌ User seeding failed: ${error.message}`, error.stack);
    }

    try {
      await this.seedAdmins();
    } catch (error) {
      this.logger.error(`❌ User seeding failed: ${error.message}`, error.stack);
    }
    
    try {
      await this.seedStations();
      await this.seedStationsFromJson(); // JSON 파일에서 스테이션 시딩
    } catch (error) {
      this.logger.error(`❌ Station seeding failed: ${error.message}`, error.stack);
    }

    try {
      await this.seedProducts(); // 상품 시딩 추가
    } catch (error) {
      this.logger.error(`❌ Product seeding failed: ${error.message}`, error.stack);
    }
    
    try {
      await this.seedUmbrellas();
    } catch (error) {
      this.logger.error(`❌ Umbrella seeding failed: ${error.message}`, error.stack);
    }
    
    this.logger.log('✅ Data seeding completed!');
  }

  private async seedAdmins() {
    const adminRepository = this.dataSource.getRepository(Admin);
    const count = await adminRepository.count();
    if (count === 0) {
      for (const adminData of ADMINS_SEED_DATA) {
        try {
          // 반드시 AdminService.createAdmin을 호출 (해싱, 유니크체크, 로그 등)
          await this.adminsService.createAdmin(adminData);
        } catch (e) {
          this.logger.error(`Error seeding admin ${adminData.email}: ${e.message}`);
        }
      }
    }
  }

  private async seedUsers() {
    const userRepository = this.dataSource.getRepository(User);
    const count = await userRepository.count();
    if (count === 0) {
      this.logger.log('  Seeding users...');
      for (const userData of USERS_SEED_DATA) {
        try {
          const newUser = await this.usersService.create(userData);
          // 사용자 생성 후 지갑에 초기 츄르와 캣닢 지급
          await this.walletsService.depositChuru(newUser.id, 1000); // 초기 1000 츄르 지급
          await this.walletsService.addCatnip(newUser.id, 50); // 초기 50 캣닢 지급
          this.logger.log(`    User ${newUser.email} created with initial Churu and Catnip.`);
        } catch (error) {
          this.logger.error(`  Error seeding user ${userData.email}: ${error.message}`);
          // 개별 사용자 생성 실패는 전체 시딩을 중단하지 않음
        }
      }
      this.logger.log(`  ${USERS_SEED_DATA.length} users seeded.`);
    } else {
      this.logger.log(`  Users already exist (${count}). Skipping user seeding.`);
    }
  }

  private async seedProducts() {
    const productRepository = this.dataSource.getRepository(Product);
    const count = await productRepository.count();
    if (count === 0) {
      this.logger.log('  Seeding products...');
      for (const productData of PRODUCTS_SEED_DATA) {
        try {
          await this.productsService.create(productData);
          this.logger.log(`    Product "${productData.name}" seeded.`);
        } catch (error) {
          this.logger.error(`  Error seeding product ${productData.name}: ${error.message}`);
        }
      }
      this.logger.log(`  ${PRODUCTS_SEED_DATA.length} products seeded.`);
    } else {
      this.logger.log(`  Products already exist (${count}). Skipping product seeding.`);
    }
  }

  // ... 기존 seedStations, seedStationsFromJson, seedUmbrellas 메서드는 그대로 유지 ...
  private async seedStations() {
    const stationRepository = this.dataSource.getRepository(Station);
    const count = await stationRepository.count();
    if (count === 0) {
      this.logger.log('  Seeding stations from static data...');
      for (const stationData of STATIONS_SEED_DATA) {
        try {
          await this.stationsService.create(stationData);
        } catch (error) {
          this.logger.error(`  Error seeding station ${stationData.name}: ${error.message}`);
          // 개별 대여소 생성 실패는 전체 시딩을 중단하지 않음
        }
      }
      this.logger.log(`  ${STATIONS_SEED_DATA.length} stations seeded from static data.`);
    } else {
      this.logger.log(`  Stations already exist (${count}). Skipping static station seeding.`);
    }
  }

  private async seedStationsFromJson() {
    const stationRepository = this.dataSource.getRepository(Station);
    const count = await stationRepository.count();
    
    // JSON 파일 읽기
    try {
      this.logger.log('  Seeding stations from JSON files...');
      
      // 부산 1호선 데이터 읽기
      const line1DataPath = path.join(__dirname, 'data', 'busan_line1_stations.json');
      if (fs.existsSync(line1DataPath)) {
        const line1JsonData = fs.readFileSync(line1DataPath, 'utf8');
        const line1Stations = JSON.parse(line1JsonData);
        await this.processStationData(line1Stations);
        this.logger.log(`  Busan Line 1 stations seeded successfully.`);
      }
      
      // 부산 4호선 데이터 읽기 (예시)
      const line4DataPath = path.join(__dirname, 'data', 'busan_line4_stations.json');
      if (fs.existsSync(line4DataPath)) {
        const line4JsonData = fs.readFileSync(line4DataPath, 'utf8');
        const line4Stations = JSON.parse(line4JsonData);
        await this.processStationData(line4Stations);
        this.logger.log(`  Busan Line 4 stations seeded successfully.`);
      }
      
      // 다른 노선 데이터도 필요하면 여기에 추가
      
    } catch (error) {
      this.logger.error(`  Error reading station JSON files: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async processStationData(stationsData: any[]) {
    for (const stationData of stationsData) {
      try {
        // 각 지하철역에 있는 대여소들을 순회
        for (const stationPoint of stationData.stations) {
          // Station 엔티티에 맞게 데이터 변환
          const stationEntity = {
            name: `${stationData.stationName}역 ${stationPoint.stationLocation}`,
            address: stationData.address,
            latitude: stationPoint.latitude,
            longitude: stationPoint.longitude,
            isActive: true,
            description: stationPoint.description
          };
          
          // 대여소 생성
          await this.stationsService.create(stationEntity);
        }
      } catch (error) {
        this.logger.error(`  Error seeding station ${stationData.stationName}: ${error.message}`);
        // 개별 대여소 생성 실패는 전체 시딩을 중단하지 않음
      }
    }
  }

  private async seedUmbrellas() {
    const umbrellaRepository = this.dataSource.getRepository(Umbrella);
    const count = await umbrellaRepository.count();
    if (count === 0) {
      this.logger.log('  Seeding umbrellas...');
      const stations = await this.stationsService.findAll();
      if (stations.length === 0) {
        this.logger.warn('    No stations found to assign umbrellas. Skipping umbrella seeding.');
        return;
      }

      let currentStationIndex = 0;
      for (const umbrellaData of UMBRELLAS_SEED_DATA) {
        try {
          const station = stations[currentStationIndex];
          await this.umbrellasService.create({
            ...umbrellaData,
            stationId: station.id,
          });
          currentStationIndex = (currentStationIndex + 1) % stations.length; // 다음 대여소로 순환
        } catch (error) {
          this.logger.error(`Error seeding umbrella ${umbrellaData.code}: ${error.message}`);
          // 개별 우산 생성 실패는 전체 시딩을 중단하지 않음
        }
      }
      this.logger.log(`  ${UMBRELLAS_SEED_DATA.length} umbrellas seeded.`);
    } else {
      this.logger.log(`  Umbrellas already exist (${count}). Skipping umbrella seeding.`);
    }
  }
}