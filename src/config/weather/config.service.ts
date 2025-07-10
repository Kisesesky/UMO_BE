import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WeatherConfigService {
  constructor(private configService: ConfigService) {}

  get weatherApiKey() {
    return this.configService.get<string>('weather.weatherApiKey');
  }
}
