// src/modules/weather/dto/midterm-forecast.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class DayForecastDto {
  @ApiProperty({ description: '예보 날짜', example: '2025-07-13' })
  date: string;

  @ApiProperty({ description: '오전 날씨', example: '맑음' })
  morning: string;

  @ApiProperty({ description: '오후 날씨', example: '구름많음' })
  afternoon: string;
}

export class MidtermForecastDto {
  @ApiProperty({ description: '기상청 지역 코드', example: '11B10101' })
  regId: string;

  @ApiProperty({
    description: '3~10일간의 중기 육상예보 (오전/오후)',
    type: [DayForecastDto],
  })
  forecasts: DayForecastDto[];

  constructor(regId: string, rawItem: any) {
    this.regId = regId;
    this.forecasts = [];

    for (let day = 3; day <= 10; day++) {
      const date = this.calculateForecastDate(day);
      const morning = rawItem[`wf${day}Am`] ?? '정보 없음';
      const afternoon = rawItem[`wf${day}Pm`] ?? '정보 없음';

      this.forecasts.push({
        date,
        morning,
        afternoon,
      });
    }
  }

  private calculateForecastDate(daysLater: number): string {
    const target = new Date();
    target.setDate(target.getDate() + daysLater);
    return target.toISOString().split('T')[0]; // yyyy-MM-dd
  }
}
