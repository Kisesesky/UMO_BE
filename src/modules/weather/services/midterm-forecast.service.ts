// src/modules/weather/services/midterm-forecast.service.ts
import { Injectable, Logger, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { WeatherConfigService } from 'src/config/weather/config.service';
import { firstValueFrom } from 'rxjs';
import { MidtermForecastDto } from '../dto/midterm-forecast.dto';
import { WeatherApiException } from 'src/common/exceptions/weather.exceptions';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';


@Injectable()
export class MidtermForecastService {
  private readonly logger = new Logger(MidtermForecastService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly weatherConfigService: WeatherConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}${month}${day}`;
  }

  private getBaseTimeForMidterm(date: Date): string {
    const hour = date.getHours();
    return hour < 18 ? '0600' : '1800';
  }

  async getMidtermForecast(regId: string): Promise<MidtermForecastDto> {
    const cacheKey = `midterm:${regId}`;
    const cached = await this.cacheManager.get<MidtermForecastDto>(cacheKey);
    if (cached) {
      this.logger.debug(`중기예보 캐시 HIT: ${regId}`);
      return cached;
    }

    const now = new Date();
    const tmFc = `${this.formatDate(now)}${this.getBaseTimeForMidterm(now)}`;

    const url = 'http://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst'; // 육상예보
    const params = {
      serviceKey: this.weatherConfigService.weatherApiKey,
      dataType: 'JSON',
      regId,
      tmFc,
    };

    try {
      const response = await firstValueFrom(this.httpService.get(url, { params }));
      const header = response.data?.response?.header;

      if (header.resultCode !== '00') {
        throw new WeatherApiException(header.resultMsg || '중기예보 API 오류');
      }

      const item = response.data.response.body.items.item[0];
      this.logger.log(`중기예보 조회 완료: regId=${regId}`);
      const dto = new MidtermForecastDto(regId, item);
      await this.cacheManager.set(cacheKey, dto, 1000 * 60 * 60 * 6);
      this.logger.debug(`중기예보 캐시 SET: ${regId}`);

      return dto;
    } catch (error) {
      this.logger.error(`중기예보 조회 실패: ${error.message}`, error.stack);
      throw new WeatherApiException('중기예보 조회 실패');
    }
  }
}
