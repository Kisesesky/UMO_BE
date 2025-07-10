// src/modules/weather/constants/weather-condition.constants.ts
export const RAIN_TYPE_TO_CONDITION = {
  0: '맑음',
  1: '비',
  2: '비/눈',
  3: '눈',
  4: '소나기',
} as const;

/**
 * 강수 형태 코드를 날씨 상태 문자열로 변환합니다.
 */
export function getWeatherConditionByRainType(rainType: number): string {
  return RAIN_TYPE_TO_CONDITION[rainType] || '알 수 없음';
}