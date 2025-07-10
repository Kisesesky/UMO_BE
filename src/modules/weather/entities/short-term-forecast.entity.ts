// src/modules/weather/entities/short-term-forecast.entity.ts
import { Column, Entity, Index } from 'typeorm';
import { BaseWeatherEntity } from '../../../common/entities/base-weather.entity';


@Entity('short_term_forecast')
@Index(['fcstDate', 'fcstTime', 'nx', 'ny'], { unique: true })
export class ShortTermForecast extends BaseWeatherEntity {
  @Column({ type: 'date', name: 'fcst_date' })
  fcstDate: Date; // 예보 날짜

  @Column({ type: 'varchar', length: 10, name: 'fcst_time' })
  fcstTime: string; // 예보 시각 (예: '0900')

  @Column({ type: 'float', nullable: true })
  temperature: number; // 예보 기온 (℃)

  @Column({ type: 'int', nullable: true })
  humidity: number; // 예보 습도 (%)

  @Column({ type: 'int', nullable: true, name: 'rain_type' })
  rainType: number; // 강수 형태

  @Column({ type: 'float', nullable: true, name: 'rain_amount' })
  rainAmount: number; // 강수량 (mm)

  @Column({ type: 'float', nullable: true, name: 'wind_speed' })
  windSpeed: number; // 풍속 (m/s)

  @Column({ type: 'int', nullable: true, name: 'wind_direction' })
  windDirection: number; // 풍향 (deg)
}
