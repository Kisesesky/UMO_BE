//src/modules/support/entities/answer.entity.ts
import { Admin } from "src/modules/admin/entities/admin.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @ManyToOne(() => Admin)
  admin: Admin;
}
