// src/modules/weather/services/weather.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { CurrentWeatherService } from './current-weather.service';
import { MidtermForecastService } from './midterm-forecast.service';
import { RegionService } from '../region/region.service';
import { KmaCoordinateUtil } from '../utils/kma-coordinate.util';
import { WeatherDataDto } from '../dto/weather-data.dto';
import { MidtermForecastDto } from '../dto/midterm-forecast.dto';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  // 기본 위치: 부산 중구 위도/경도 (예시)
  private readonly DEFAULT_LAT = 35.10278;
  private readonly DEFAULT_LON = 129.04028;

  constructor(
    private readonly currentWeatherService: CurrentWeatherService,
    private readonly midtermForecastService: MidtermForecastService,
    private readonly regionService: RegionService,
  ) {}

  /**
   * 위도, 경도를 기상청 격자 좌표(nx, ny)로 변환
   */
  private convertLatLonToGrid(lat?: number, lon?: number) {
    if (lat != null && lon != null) {
      return KmaCoordinateUtil.convertLatLngToKmaGrid(lat, lon);
    }
    return KmaCoordinateUtil.convertLatLngToKmaGrid(this.DEFAULT_LAT, this.DEFAULT_LON);
  }

  /**
   * 위도, 경도를 이용해 지역 코드(regId)를 반환.
   * 매핑 실패 시 기본값 사용.
   */
  private getRegId(lat: number, lon: number): string {
    const regId = this.regionService.getRegionCodeByCoordinate(lat, lon);
    if (!regId) {
      this.logger.warn(`지역코드 미발견, 기본값 사용: 위도=${lat}, 경도=${lon}`);
      return '11H20000'; // 부산(광역) 기본값
    }
    return regId;
  }

  /**
   * 현재 날씨 조회 (단기예보)
   * @param lat 위도 (optional)
   * @param lon 경도 (optional)
   */
  async getCurrentWeather(lat?: number, lon?: number): Promise<WeatherDataDto> {
    try {
      const { nx, ny } = this.convertLatLonToGrid(lat, lon);
      this.logger.log(`현재 날씨 조회 요청 - nx:${nx}, ny:${ny}`);
      return await this.currentWeatherService.getCurrentWeather(nx, ny);
    } catch (error) {
      this.logger.error(`현재 날씨 조회 실패: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 중기예보 조회
   * @param lat 위도 (optional)
   * @param lon 경도 (optional)
   */
  async getMidtermForecast(lat?: number, lon?: number): Promise<MidtermForecastDto> {
    try {
      const latitude = lat ?? this.DEFAULT_LAT;
      const longitude = lon ?? this.DEFAULT_LON;
      const regId = this.getRegId(latitude, longitude);
      this.logger.log(`중기예보 조회 요청 - regId: ${regId}`);
      return await this.midtermForecastService.getMidtermForecast(regId);
    } catch (error) {
      this.logger.error(`중기예보 조회 실패: ${error.message}`, error.stack);
      throw error;
    }
  }
}
