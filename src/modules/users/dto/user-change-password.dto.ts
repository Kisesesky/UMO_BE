// src/modules/users/dto/user-change-password.dto.ts
import { IsString, MinLength } from 'class-validator';

export class UserChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(8)
  newPassword: string;

  @IsString()
  @MinLength(8)
  confirmPassword: string;
}
