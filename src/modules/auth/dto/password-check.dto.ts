// src/auth/dto/password-check.dto.ts
import { IsNotEmpty, IsString } from "class-validator";

export class PasswordCheckDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}
