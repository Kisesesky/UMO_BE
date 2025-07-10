// src/modules/weather/entities/daily-weather-forecast.entity.ts
import { Column, Entity, Index } from 'typeorm';
import { BaseWeatherEntity } from '../../../common/entities/base-weather.entity';


@Entity('daily_weather_forecast')
@Index(['forecastDate', 'nx', 'ny'], { unique: true }) // 날짜, 지역별로 유니크하게 저장
export class DailyWeatherForecast extends BaseWeatherEntity {
  @Column({ type: 'date', name: 'forecast_date' })
  forecastDate: Date; // 예보 대상 날짜 (예: 2025-07-01)

  @Column({ type: 'float', nullable: true, name: 'min_temperature' })
  minTemperature: number; // 최저 기온 (℃)

  @Column({ type: 'float', nullable: true, name: 'max_temperature' })
  maxTemperature: number; // 최고 기온 (℃)

  @Column({ type: 'int', nullable: true, name: 'am_precipitation_prob' })
  amPrecipitationProb: number; // 오전 강수 확률 (%)

  @Column({ type: 'int', nullable: true, name: 'pm_precipitation_prob' })
  pmPrecipitationProb: number; // 오후 강수 확률 (%)

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'am_weather_condition' })
  amWeatherCondition: string; // 오전 날씨 상태 (예: '맑음', '구름많음', '비')

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'pm_weather_condition' })
  pmWeatherCondition: string; // 오후 날씨 상태 (예: '맑음', '구름많음', '비')

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'reg_id' })
  regId: string; // 중기예보용 지역 코드 (예: '11H20000')
}