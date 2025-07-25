// src/modules/umbrellas/entities/umbrella.entity.ts
import { UmbrellaStatus, UMBRELLA_STATUS } from "../constants/umbrella-status";
import { BaseEntity } from 'src/common/entities/base.entity';
import { Rental } from "src/modules/rentals/entities/rental.entity";
import { Station } from "src/modules/stations/entities/station.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class Umbrella extends BaseEntity {
  @Column()
  code: string;

  @Column({ type: 'varchar', default: UMBRELLA_STATUS.AVAILABLE })
  status: UmbrellaStatus;

  @Column({ default: false })
  isLost: boolean; // 분실 여부

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  rentalFeePerHour: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number; // 우산 가격 (분실 시 배상금 계산용)

  @Column({ nullable: true })
  stationId: number; // 현재 위치한 대여소 ID

  @ManyToOne(() => Station, station => station.umbrellas)
  @JoinColumn({ name: 'stationId' }) // stationId 컬럼을 외래키로 사용
  station: Station; // 현재 위치한 대여소
  
  @OneToMany(() => Rental, rental => rental.umbrella)
  rentals: Rental[];
}
