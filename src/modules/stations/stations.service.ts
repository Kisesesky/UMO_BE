// src/modules/stations/stations.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from './entities/station.entity';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { StationNotFoundException, StationAlreadyExistsException, StationInactiveException } from 'src/common/exceptions/station.exceptions';
import { UmbrellasService } from '../umbrellas/umbrellas.service';

@Injectable()
export class StationsService {
  private readonly logger = new Logger(StationsService.name);

  constructor(
    @InjectRepository(Station)
    private stationRepository: Repository<Station>,
    private umbrellasService: UmbrellasService,
  ) {}

  async findAll(): Promise<Station[]> {
    // try-catch 제거
    return await this.stationRepository.find();
  }

  async findOne(id: number): Promise<Station> {
    const station = await this.stationRepository.findOne({ where: { id } });
    if (!station) {
      throw new StationNotFoundException();
    }
    return station;
  }

  async create(createStationDto: CreateStationDto): Promise<Station> {
    // 이름이나 주소로 중복 체크
    const existingStation = await this.stationRepository.findOne({ 
      where: [
        { name: createStationDto.name },
        { address: createStationDto.address }
      ]
    });
    
    if (existingStation) {
      throw new StationAlreadyExistsException();
    }

    const newStation = this.stationRepository.create(createStationDto);
    return await this.stationRepository.save(newStation);
  }

  async update(id: number, updateStationDto: UpdateStationDto): Promise<Station> {
    const station = await this.findOne(id); // 존재 여부 확인
    Object.assign(station, updateStationDto);
    return await this.stationRepository.save(station);
  }

  async remove(id: number): Promise<void> {
    const result = await this.stationRepository.delete(id);
    if (result.affected === 0) {
      throw new StationNotFoundException();
    }
  }

  async getUmbrellaCount(stationId: number): Promise<number> {
    const station = await this.findOne(stationId);
    const umbrellas = await this.umbrellasService.findByStation(stationId);
    return umbrellas.length;
  }

  async getUmbrellasInStation(stationId: number): Promise<any[]> {
    const station = await this.findOne(stationId);
    if (!station.isActive) {
      throw new StationInactiveException();
    }
    return await this.umbrellasService.findByStation(stationId);
  }

  async findNearestStation(latitude: number, longitude: number): Promise<Station> {
    const stations = await this.stationRepository.find({ where: { isActive: true } });
    if (stations.length === 0) {
      throw new StationNotFoundException();
    }

    let nearestStation: Station | null = null;
    let minDistance = Infinity;

    // 간단한 유클리드 거리 계산
    stations.forEach(station => {
      const distance = Math.sqrt(
        Math.pow(latitude - station.latitude, 2) +
        Math.pow(longitude - station.longitude, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestStation = station;
      }
    });

    if (!nearestStation) {
      throw new StationNotFoundException();
    }

    return nearestStation;
  }
}