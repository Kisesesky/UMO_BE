// src/modules/users/users.service.ts
import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterStatus } from 'src/common/constants/register-status';
import { PasswordUtil } from 'src/common/utils/password-util';
import { WalletsService } from 'src/modules/wallets/wallets.service';
import { Repository } from 'typeorm';
import { InviteCodeService } from '../invites/invite-code.service';
import { USER_ROLE } from './constants/user-role';
import { UserStatus, USER_STATUS } from './constants/user-status';
import { User } from './entities/user.entity';
import {
  UserBannedException, UserEmailExistsException, UserInactiveException, UserNotFoundException, UserPendingVerificationException, UserSuspendedException
} from './exceptions/user.exceptions';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private walletsService: WalletsService,
    private inviteCodeService: InviteCodeService
  ) {}

  async findAll(options: { page: number; limit: number; status?: string }): Promise<User[]> {
    const qb = this.usersRepository.createQueryBuilder('user');
    if (options.status) {
      qb.where('user.status = :status', { status: options.status });
    }
    qb.skip((options.page - 1) * options.limit).take(options.limit);
    return qb.getMany();
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async findUserBySocialId(socialId: string, provider: RegisterStatus): Promise<User | null> {
    return this.usersRepository.findOne({ where: { socialId, provider } });
  }

  async updatePassword(email: string, hashedPassword: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UserNotFoundException();
    }
    user.password = hashedPassword;
    return this.usersRepository.save(user);
  }

  async create(userData: Partial<User>): Promise<User> {
    // 이메일 중복 체크 (이메일이 있을 때만)
    if (userData.email) {
      const existingUser = await this.usersRepository.findOne({ where: { email: userData.email } });
      if (existingUser) throw new UserEmailExistsException();
    }

    // 기본 상태 및 역할 설정
    userData.status = userData.status || USER_STATUS.ACTIVE;
    userData.role = userData.role || USER_ROLE.USER;

    const newUser = this.usersRepository.create({
      ...userData,
      agreedTerms: userData.agreedTerms ?? false,
      agreedPrivacy: userData.agreedPrivacy ?? false,
      status: userData.status || USER_STATUS.ACTIVE,
      role: userData.role || USER_ROLE.USER,
    });
    const savedUser = await this.usersRepository.save(newUser);

    // 지갑 생성 (필요시)
    await this.walletsService.createWallet(savedUser.id);
    await this.inviteCodeService.generateInviteCodeForUser(savedUser);

    return savedUser;
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    const user = await this.findUserById(id);
    Object.assign(user, userData);
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findUserById(id);
    await this.walletsService.deactivateWallet(user.id);
    await this.usersRepository.remove(user);
  }

  async changePassword(email: string, currentPassword: string, newPassword: string, confirmPassword: string): Promise<string> {
    // 1. 유저 존재 확인
    const user = await this.findByEmail(email);
    if (!user) throw new UserNotFoundException();

    if (!user.password) {
      throw new UnauthorizedException('비밀번호가 설정되어 있지 않습니다.');
    }
  
    // 2. 현재 비밀번호 일치 검증
    if (!(await PasswordUtil.compare(currentPassword, user.password))) {
      throw new UnauthorizedException('현재 비밀번호가 일치하지 않습니다.');
    }
  
    // 3. 새 비밀번호 2회 입력 확인
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('새 비밀번호가 일치하지 않습니다.');
    }
  
    // 4. 신규 비밀번호 보안 검증
    PasswordUtil.validatePassword(newPassword);
  
    // 추후 확장: 동일 비번/최근 비번 기록 검사 등...
  
    // 5. 비밀번호 업데이트
    const hashedPassword = await PasswordUtil.hash(newPassword);
    await this.updatePassword(email, hashedPassword);
  
    // 6. 성공 메시지(테스트나 client용)
    return '비밀번호가 성공적으로 변경되었습니다.';
  }
  

  // 사용자 상태 검증 메서드
  validateUserStatus(user: User): void {
    switch (user.status) {
      case USER_STATUS.INACTIVE:
        throw new UserInactiveException();
      case USER_STATUS.SUSPENDED:
        throw new UserSuspendedException();
      case USER_STATUS.BANNED:
        throw new UserBannedException();
      case USER_STATUS.PENDING_VERIFICATION:
        throw new UserPendingVerificationException();
    }
  }

  // 사용자 상태 변경 메서드
  async userChangeStatus(id: number, status: UserStatus): Promise<User> {
    const user = await this.findUserById(id);
    user.status = status;
    return this.usersRepository.save(user);
  }

  async findOrCreateSocialUser(params: {
    provider: RegisterStatus;
    socialId: string;
    email?: string;
    name?: string;
    profileImage?: string;
  }): Promise<User> {
    const { provider, socialId, email, name, profileImage } = params;
  
    // 1. 소셜 ID + provider로 사용자 찾기
    let user = await this.usersRepository.findOne({
      where: { socialId, provider },
    });
  
    if (user) {
      this.logger.debug(`소셜 로그인 성공: 기존 사용자 (ID: ${user.id})`);
      return user;
    }
  
    // 2. 동일한 이메일로 기존 사용자 연동 시도
    if (email) {
      const existingUserByEmail = await this.usersRepository.findOne({ where: { email } });
  
      if (existingUserByEmail) {
        this.logger.warn(`이메일로 기존 사용자와 연동: ${email}`);
  
        existingUserByEmail.socialId = socialId;
        existingUserByEmail.provider = provider;
  
        // 필요한 경우에만 덮어쓰기 (기존 정보 보호)
        if (name && !existingUserByEmail.name?.startsWith('소셜 사용자')) {
          existingUserByEmail.name = name;
        }
        if (profileImage) {
          existingUserByEmail.profileImage = profileImage;
        }
  
        const updatedUser = await this.usersRepository.save(existingUserByEmail);
        return updatedUser;
      }
    }
  
    // 3. 완전히 새로운 사용자 생성
    const newUserData: Partial<User> = {
      socialId,
      provider,
      email: email,
      name: name ?? '소셜 사용자',
      profileImage: profileImage,
      status: USER_STATUS.ACTIVE,
      role: USER_ROLE.USER,
    };
  
    const newUser = this.usersRepository.create(newUserData);
    const savedUser = await this.usersRepository.save(newUser);
  
    this.logger.log(`새 소셜 사용자 생성 (ID: ${savedUser.id}, provider: ${provider})`);
  
    // 기본 지갑 생성
    try {
      await this.walletsService.createWallet(savedUser.id);
    } catch (err) {
      this.logger.error(`지갑 생성 실패 (userId: ${savedUser.id})`, err.stack);
      // 실패하더라도 유저는 그대로 반환
    }
  
    return savedUser;
  }
}