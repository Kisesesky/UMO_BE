// src/common/messages/weather-messages.ts
export const WEATHER_MESSAGE = {
  NO_DATA: '날씨 데이터가 없습니다.',
  API_ERROR: (msg: string) => `기상청 API 오류: ${msg}`,
  MIDTERM_NO_DATA: '중기예보 데이터를 찾을 수 없습니다.',
  DAILY_FORECAST_NOT_FOUND: (date: string) => `${date} 날짜의 예보 데이터를 찾을 수 없습니다.`,
  FETCH_ERROR: '날씨 예보 데이터를 조회하는 중 오류가 발생했습니다.',
  CURRENT_FETCH_ERROR: '현재 날씨 정보를 가져오는 중 오류가 발생했습니다.',
  MIDTERM_LAND_NO_DATA: '중기육상예보 데이터를 찾을 수 없습니다.',
  MIDTERM_LAND_EMPTY: '중기육상예보 데이터가 없습니다.',
  MIDTERM_LAND_API_ERROR: (msg: string) => `기상청 중기육상예보 API 오류: ${msg}`,
  MIDTERM_TEMP_EMPTY: '중기기온예보 데이터가 없습니다.',
  MIDTERM_TEMP_API_ERROR: (msg: string) => `기상청 중기기온예보 API 오류: ${msg}`,
  MIDTERM_FETCH_ERROR: '중기예보 데이터를 가져오는 중 오류가 발생했습니다.',
  WEEKLY_FETCH_ERROR: '주간 예보 데이터를 조회하는 중 오류가 발생했습니다.',
} as const;
