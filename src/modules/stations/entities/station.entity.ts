// src/stations/entities/station.entity.ts
import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "src/common/entities/base.entity";
import { Umbrella } from "src/modules/umbrellas/entities/umbrella.entity";

@Entity()
export class Station extends BaseEntity {
  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  description: string;

  // 이 대여소에 있는 우산들과의 관계
  @OneToMany(() => Umbrella, umbrella => umbrella.station)
  umbrellas: Umbrella[];
}
