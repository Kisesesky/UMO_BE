// src/users/dto/user-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/common/constants/user-role';
import { UserStatus, USER_STATUS_VALUES } from 'src/common/constants/user-status';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { User } from '../entities/user.entity';
import { USER_ROLE_VALUES } from '../../../common/constants/user-role';
import { RegisterStatus, REGISTER_STATUS_VALUES } from 'src/common/constants/register-status';

export class UserResponseDto extends BaseResponseDto {
  @ApiProperty({ example: '김철수', description: '사용자 이름' })
  name: string;

  @ApiProperty({ example: 'test@example.com', description: '사용자 이메일', required: false })
  email: string;

  @ApiProperty({ example: 'USER', enum: USER_ROLE_VALUES, description: '사용자 역할' })
  role: UserRole;

  @ApiProperty({ example: 'ACTIVE', enum: USER_STATUS_VALUES, description: '사용자 상태' })
  status: UserStatus;
  
  @ApiProperty({ example: 'KAKAO', enum: REGISTER_STATUS_VALUES, description: '가입 경로 (소셜/이메일)' })
  provider: RegisterStatus;

  // 지갑 ID 추가 (선택 사항)
  @ApiProperty({ example: 1, description: '지갑 ID', required: false })
  walletId?: number;

  constructor(user: User) {
    super(user);
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.status = user.status;
    
    // 지갑 정보가 있으면 walletId 설정
    if (user.wallet) {
      this.walletId = user.wallet.id;
    }
  }
}
