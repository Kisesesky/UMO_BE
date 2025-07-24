//src/config/app/configuration.ts
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  accessExpiresIn: process.env.ACCESS_EXPIRES_IN,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  adminJwtSecret: process.env.ADMIN_JWT_SECRET,
  adminJwtRefreshSecret: process.env.ADMIN_JWT_REFRESH_SECRET,
  adminAccessExpiresIn: process.env.ADMIN_ACCESS_EXPIRES_IN,
  adminJwtRefreshExpiresIn: process.env.ADMIN_JWT_REFRESH_EXPIRES_IN,
  port: parseInt(process.env.PORT || '3000', 10),
  frontendUrl: process.env.FRONTEND_URL,
  gmailUser: process.env.GMAIL_USER,
  gmailPass: process.env.GMAIL_PASS,
  defaultProfileImg: process.env.DEFAULT_PROFILE_IMAGE,
  defaultMainImg: process.env.DEFAULT_MAIN_IMAGE,
  defaultLogoImg: process.env.DEFAULT_LOGO_IMAGE,
}));
