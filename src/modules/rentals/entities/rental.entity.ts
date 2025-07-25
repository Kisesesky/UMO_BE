// src/modules/rentals/entities/rental.entity.ts
import { RentalStatus, RENTAL_STATUS } from '../constants/rental-status';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Umbrella } from '../../umbrellas/entities/umbrella.entity';
import { User } from '../../users/entities/user.entity';

@Entity('rentals')
export class Rental extends BaseEntity {
  @Column({ type: 'timestamp', name: 'rental_start' })
  rentalStart: Date;

  @Column({ type: 'timestamp', name: 'rental_end', nullable: true })
  rentalEnd: Date;

  @Column({ type: 'varchar', default: RENTAL_STATUS.PENDING })
  status: RentalStatus;

  @Column({ type: 'int', name: 'rental_station_id' })
  rentalStationId: number;

  @Column({ type: 'int', name: 'return_station_id', nullable: true })
  returnStationId: number;

  @Column({ type: 'int', name: 'total_fee', default: 0 })
  totalFee: number;

  @Column({ type: 'int', name: 'deposit_amount', default: 0 })
  depositAmount: number; // 보증금 금액 필드 추가

  @ManyToOne(() => User, user => user.rentals)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Umbrella, umbrella => umbrella.rentals)
  @JoinColumn({ name: 'umbrella_id' })
  umbrella: Umbrella;
}
