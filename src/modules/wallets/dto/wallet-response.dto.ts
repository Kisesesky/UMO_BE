// src/wallets/dto/wallet-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Wallet } from '../entities/wallet.entity';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';

export class WalletResponseDto extends BaseResponseDto {
  @ApiProperty({ example: 1000, description: '츄르 잔액' })
  churuBalance: number;

  @ApiProperty({ example: 50, description: '캣닢 잔액' })
  catnipBalance: number;

  @ApiProperty({ example: 1, description: '사용자 ID' })
  userId: number;

  constructor(wallet: Wallet) {
    super(wallet);
    this.churuBalance = wallet.churuBalance;
    this.catnipBalance = wallet.catnipBalance;
    this.userId = wallet.userId;
  }
}