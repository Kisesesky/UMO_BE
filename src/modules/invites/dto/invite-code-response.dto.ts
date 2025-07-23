// src/modules/invites/dto/invite-code-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class InviteCodeResponseDto {
  @ApiProperty({ example: 'UMBRELLA20251234' })
  inviteCode: string;
}

export class InviteCodeCheckResponseDto {
  @ApiProperty({ example: true })
  valid: boolean;

  @ApiProperty({ example: 'uuid값', required: false })
  ownerId?: string;

  @ApiProperty({ example: '2025-07-23T10:45:00.000Z', required: false })
  createdAt?: Date;
}
