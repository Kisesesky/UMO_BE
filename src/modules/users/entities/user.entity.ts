//./../../users/entities/user.entity.ts
import { RegisterStatus, REGISTER_STATUS } from 'src/common/constants/register-status';
import { UserRole, USER_ROLE } from "../constants/user-role";
import { UserStatus, USER_STATUS } from "../constants/user-status";
import { BaseEntity } from "src/common/entities/base.entity";
import { InviteCode } from 'src/modules/invites/entities/invite-code.entity';
import { Location } from 'src/modules/locations/entities/location.entity';
import { Referral } from 'src/modules/referrals/entities/referral.entity';
import { Rental } from "src/modules/rentals/entities/rental.entity";
import { Wallet } from "src/modules/wallets/entities/wallet.entity";
import { Column, Entity, OneToMany, OneToOne } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ type: 'varchar', default: USER_ROLE.USER })
  role: UserRole;

  @Column({ type: 'varchar', default: USER_STATUS.ACTIVE })
  status: UserStatus;

  @Column({ unique: true, nullable: true })
  socialId?: string;

  @Column({ type: 'varchar', default: REGISTER_STATUS.EMAIL })
  provider: RegisterStatus;

  @Column({ nullable: true })
  profileImage?: string;

  @Column({ default: false })
  agreedTerms: boolean;

  @Column({ default: false })
  agreedPrivacy: boolean;

  @OneToMany(()=> Rental, rental => rental.user)
  rentals: Rental[];

  @OneToOne(() => Wallet, wallet => wallet.user)
  wallet: Wallet;

  @OneToMany(() => Location, location => location.user)
  locations: Location[]

  @OneToMany(() => InviteCode, invite => invite.owner, { cascade: true })
  inviteCodes: InviteCode[];

  @OneToMany(() => Referral, referral => referral.referrer)
  referrals: Referral[];  // 내가 추천한 사람들

  @OneToMany(() => Referral, referral => referral.referred)
  referred: Referral[];   // 내가 추천 받은 기록
}
