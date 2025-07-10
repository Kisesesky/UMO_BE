// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppConfigModule } from 'src/config/app/config.module';
import { AppConfigService } from 'src/config/app/config.service';
import { SocialConfigModule } from 'src/config/social/config.module';
import { RedisModule } from '../redis/redis.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AuthServiceController } from './controllers/auth.service.controller';
import { EmailCheckVerificationService } from './services/email-check-verification.service';
import { EmailVerificationService } from './services/email-verification.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { KakaoAuthGuard } from './guards/kakao-auth.guard';
import { NaverAuthGuard } from './guards/naver-auth.guard';
import { PasswordService } from './services/password.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { KakaoStrategy } from './strategies/kakao.strategy';
import { NaverStrategy } from './strategies/naver.strategy';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    AppConfigModule,
    UsersModule,
    PassportModule,
    AppConfigModule,
    SocialConfigModule,
    RedisModule,
    AdminModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => ({
        secret: appConfigService.jwtSecret,
        signOptions: { expiresIn: appConfigService.accessExpiresIn },
      }),
    }),
  ],
  controllers: [AuthController, AuthServiceController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, GoogleAuthGuard, KakaoStrategy, KakaoAuthGuard, NaverStrategy, NaverAuthGuard, EmailVerificationService, EmailCheckVerificationService, PasswordService],
  exports: [AuthService],
})
export class AuthModule {}
