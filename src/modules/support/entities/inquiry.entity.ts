// src/modules/support/entities/inquiry.entity.ts
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Answer } from "./answer.entity";

@Entity()
export class Inquiry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ default: 'PENDING' })
  status: string; // 'PENDING', 'IN_PROGRESS', 'RESOLVED'

  @ManyToOne(() => User)
  user: User;

  @OneToOne(() => Answer)
  answer: Answer;
}
