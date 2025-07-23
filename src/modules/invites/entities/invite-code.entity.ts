// src/modules/invites/entities/invite-code.entity.ts
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, CreateDateColumn, Index } from "typeorm";
import { User } from "src/modules/users/entities/user.entity";

@Entity()
@Unique(['code'])
export class InviteCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ unique: true, length: 24 })
  code: string;

  @ManyToOne(() => User, user => user.inviteCodes, { onDelete: 'CASCADE', nullable: false, eager: false })
  owner: User;

  @CreateDateColumn()
  createdAt: Date;
}
