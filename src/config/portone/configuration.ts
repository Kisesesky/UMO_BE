//src/config/portone/configuration.ts
import { registerAs } from '@nestjs/config';

export default registerAs('portone', () => ({
  portoneCode: process.env.PORTONE_CODE,
  portoneApiKey: process.env.PORTONE_API_KEY,
  portoneApiSecret: process.env.PORTONE_API_SECRET,
}));
