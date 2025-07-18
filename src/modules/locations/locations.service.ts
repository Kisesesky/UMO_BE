// src/modules/locations/locations.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  // 위치 이력 저장 (유저별)
  async createLocation(user: User, dto: CreateLocationDto): Promise<Location> {
    const location = this.locationRepository.create({
      latitude: dto.latitude,
      longitude: dto.longitude,
      user, // User 객체 전달
    });
    return this.locationRepository.save(location);
  }

  // 최신 위치 가져오기
  async getLatestLocation(userId: number): Promise<Location | null> {
    return this.locationRepository.findOne({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  // 모든 위치 이력 (최신순)
  async getLocations(userId: number, limit: number = 20) {
    return this.locationRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
