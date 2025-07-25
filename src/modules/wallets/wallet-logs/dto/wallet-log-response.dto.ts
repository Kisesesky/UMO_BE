// src/modules/wallets/logs/dto/walletlog-response.dto.ts
import { BaseResponseDto } from 'src/common/dto/base-response.dto';

export class WalletLogResponseDto extends BaseResponseDto {
  assetType: string;
  amount: number;
  action: string;
  refType?: string;
  refId?: number;
}
