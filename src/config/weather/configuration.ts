import { registerAs } from '@nestjs/config';

export default registerAs('weather', () => ({
  weatherApiKey: process.env.KMA_API_KEY,
}));
