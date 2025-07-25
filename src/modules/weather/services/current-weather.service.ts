// src/modules/weather/services/current-weather.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { WeatherConfigService } from 'src/config/weather/config.service';
import { firstValueFrom } from 'rxjs';
import { WeatherDataDto } from '../dto/weather-data.dto';
import { WeatherApiException, WeatherNoDataException, CurrentWeatherFetchException } from '../exceptions/weather.exceptions';

@Injectable()
export class CurrentWeatherService {
  private readonly logger = new Logger(CurrentWeatherService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly weatherConfigService: WeatherConfigService,
  ) {}

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}${month}${day}`;
  }

  private getBaseTime(date: Date): string {
    const hour = date.getHours();
    const minute = date.getMinutes();
    if (minute < 30) {
      const prevHour = hour === 0 ? 23 : hour - 1;
      return `${prevHour.toString().padStart(2, '0')}30`;
    }
    return `${hour.toString().padStart(2, '0')}30`;
  }

  async getCurrentWeather(nx: number, ny: number): Promise<WeatherDataDto> {
    try {
      this.logger.log(`현재 날씨 조회 시작: nx=${nx}, ny=${ny}`);

      const now = new Date();
      const baseDate = this.formatDate(now);
      const baseTime = this.getBaseTime(now);

      const url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst';
      const params = {
        serviceKey: this.weatherConfigService.weatherApiKey,
        numOfRows: '60',
        pageNo: '1',
        dataType: 'JSON',
        base_date: baseDate,
        base_time: baseTime,
        nx: nx.toString(),
        ny: ny.toString(),
      };

      const response = await firstValueFrom(this.httpService.get(url, { params }));
      const header = response.data?.response?.header;

      if (header.resultCode !== '00') {
        throw new WeatherApiException(header.resultMsg || '기상청 API 오류');
      }

      const items = response.data.response.body.items.item;
      if (!items || items.length === 0) {
        throw new WeatherNoDataException();
      }

      const fcstDate = items[0]?.fcstDate ?? baseDate;
      const fcstTime = items[0]?.fcstTime ?? baseTime;
      const weatherData = this.parseWeatherData(items, fcstDate, fcstTime);

      this.logger.log(`현재 날씨 조회 완료: 온도=${weatherData.temperature}℃`);

      return weatherData;
    } catch (error) {
      this.logger.error(`현재 날씨 조회 실패: ${error.message}`, error.stack);
      throw new CurrentWeatherFetchException();
    }
  }

  private parseWeatherData(items: any[], fcstDate: string, fcstTime: string): WeatherDataDto {
    const weatherData = new WeatherDataDto({
      baseDate: items[0]?.baseDate ?? '',
      baseTime: items[0]?.baseTime ?? '',
      fcstDate,
      fcstTime,
      temperature: 0,
      rainAmount: 0,
      humidity: 0,
      rainType: 0,
      windDirection: 0,
      windSpeed: 0,
    });
  
    for (const item of items) {
      if (item.fcstDate === fcstDate && item.fcstTime === fcstTime) {
        switch (item.category) {
          case 'T1H': // 기온
            weatherData.temperature = Number(item.fcstValue);
            break;
          case 'RN1': // 1시간 강수량
            weatherData.rainAmount = Number(item.fcstValue);
            break;
          case 'REH': // 습도
            weatherData.humidity = Number(item.fcstValue);
            break;
          case 'PTY': // 강수형태
            weatherData.rainType = Number(item.fcstValue);
            break;
          case 'VEC': // 풍향
            weatherData.windDirection = Number(item.fcstValue);
            break;
          case 'WSD': // 풍속
            weatherData.windSpeed = Number(item.fcstValue);
            break;
        }
      }
    }
  
    return weatherData;
  }
}
