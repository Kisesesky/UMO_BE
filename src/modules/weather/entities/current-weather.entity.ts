// src/modules/weather/entities/current-weather.entity.ts
import { Column, Entity, Index } from 'typeorm';
import { BaseWeatherEntity } from '../../../common/entities/base-weather.entity';

@Entity('current_weather')
@Index(['nx', 'ny', 'observedAt'], { unique: true })
export class CurrentWeather extends BaseWeatherEntity {
  @Column({ type: 'float' })
  temperature: number; // 현재 기온 (℃)

  @Column({ type: 'int' })
  humidity: number; // 습도 (%)

  @Column({ type: 'int' })
  rainType: number; // 강수 형태 코드 (0: 없음, 1: 비, 2: 비/눈, 3: 눈, 4: 소나기)

  @Column({ type: 'float' })
  windSpeed: number; // 풍속 (m/s)

  @Column({ type: 'int' })
  windDirection: number; // 풍향 (deg)

  @Column({ type: 'timestamp' })
  observedAt: Date; // 관측 시각
}
