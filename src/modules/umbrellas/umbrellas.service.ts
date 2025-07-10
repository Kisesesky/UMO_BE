// src/modules/umbrellas/umbrellas.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UmbrellaStatus, UMBRELLA_STATUS } from 'src/common/constants/umbrella-status';
import { UmbrellaNotFoundException, UmbrellaStatusException } from 'src/common/exceptions/umbrella.exceptions';
import { UmbrellaMessages } from 'src/common/messages/umbrella-messages';
import { Repository } from 'typeorm';
import { Umbrella } from './entities/umbrella.entity';

@Injectable()
export class UmbrellasService {
  private readonly logger = new Logger(UmbrellasService.name);

  constructor(
    @InjectRepository(Umbrella)
    private umbrellaRepository: Repository<Umbrella>,
  ) {}

  async findAll(): Promise<Umbrella[]> {
    return await this.umbrellaRepository.find();
  }

  async findAvailable(): Promise<Umbrella[]> {
    return await this.umbrellaRepository.find({ where: { status: UMBRELLA_STATUS.AVAILABLE } });
  }

  async findOne(id: number): Promise<Umbrella> {
    const umbrella = await this.umbrellaRepository.findOne({ where: { id } });
    if (!umbrella) {
      throw new UmbrellaNotFoundException();
    }
    return umbrella;
  }

  async findByCode(code: string): Promise<Umbrella> {
    const umbrella = await this.umbrellaRepository.findOne({ where: { code } });
    if (!umbrella) {
      throw new UmbrellaNotFoundException();
    }
    return umbrella;
  }

  async create(umbrella: Partial<Umbrella>): Promise<Umbrella> {
    if (umbrella.code) {
      const existingUmbrella = await this.umbrellaRepository.findOne({ where: { code: umbrella.code } });
      if (existingUmbrella) {
        throw new Error(`이미 존재하는 우산 코드입니다: ${umbrella.code}`);
      }
    }
    
    const newUmbrella = this.umbrellaRepository.create(umbrella);
    return await this.umbrellaRepository.save(newUmbrella);
  }

  async update(id: number, umbrella: Partial<Umbrella>): Promise<Umbrella> {
    const result = await this.umbrellaRepository.update(id, umbrella);
    if (result.affected === 0) {
      throw new UmbrellaNotFoundException();
    }
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.umbrellaRepository.delete(id);
    if (result.affected === 0) {
      throw new UmbrellaNotFoundException();
    }
  }

  async umbrellaChangeStatus(id: number, newStatus: UmbrellaStatus): Promise<Umbrella> {
    const umbrella = await this.findOne(id);
    
    // 상태 변경 유효성 검사 (예: LOST 상태의 우산은 다른 상태로 변경 불가)
    if (umbrella.status === UMBRELLA_STATUS.LOST && newStatus !== UMBRELLA_STATUS.LOST) {
      throw new UmbrellaStatusException(UmbrellaMessages.ALREADY_LOST);
    }
    
    umbrella.status = newStatus;
    return await this.umbrellaRepository.save(umbrella);
  }
  
  async markAsLost(id: number): Promise<Umbrella> {
    const umbrella = await this.findOne(id);
    if (umbrella.isLost) {
      throw new UmbrellaStatusException(UmbrellaMessages.ALREADY_LOST);
    }
    umbrella.status = UMBRELLA_STATUS.LOST;
    umbrella.isLost = true;
    return await this.umbrellaRepository.save(umbrella);
  }
  
  async markAsAvailable(id: number): Promise<Umbrella> {
    return await this.update(id, { status: UMBRELLA_STATUS.AVAILABLE });
  }
  
  async findByStation(stationId: number, status?: UmbrellaStatus): Promise<Umbrella[]> {
    const where: any = { stationId };
    if (status) {
      where.status = status;
    }
    return await this.umbrellaRepository.find({ where });
  }
  
  async moveToStation(id: number, stationId: number): Promise<Umbrella> {
    const umbrella = await this.findOne(id);
    umbrella.stationId = stationId;
    return await this.umbrellaRepository.save(umbrella);
  }
}