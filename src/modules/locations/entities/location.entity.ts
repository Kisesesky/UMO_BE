// src/modules/locations/entities/location.entity.ts
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index } from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float', { nullable: false })
  latitude: number;

  @Column('float', { nullable: false })
  longitude: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.locations, { eager: false })
  @Index(['user', 'createdAt'])
  user: User;
}
