// src/modules/users/dto/update-profile.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'tester', description: '사용자 이름' })
  @IsNotEmpty()
  @MaxLength(8)
  @Matches(/^[가-힣a-zA-Z0-9]+$/)
  @IsString()
  name: string;
}
