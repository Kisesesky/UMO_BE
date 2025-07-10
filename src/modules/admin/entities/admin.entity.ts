//src/modules/admin/entities/admin.entity.ts
import { AdminRole, ADMIN_ROLE, ADMIN_ROLE_VALUES } from 'src/common/constants/admin-role';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, DeleteDateColumn } from 'typeorm';

@Entity()
export class Admin extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ADMIN_ROLE_VALUES, default: ADMIN_ROLE.GENERAL_ADMIN })
  role: AdminRole;

  @Column({ default: true })
  isActive: boolean;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
