// src/modules/weather/exceptions/weather.exceptions.ts
import { InternalServerErrorException } from '@nestjs/common';
import { WEATHER_MESSAGE } from '../messages/weather-messages';

class BaseWeatherException extends InternalServerErrorException {
  constructor(message: string) {
    super(message);
  }
}

export class WeatherNoDataException extends BaseWeatherException {
  constructor() {
    super(WEATHER_MESSAGE.NO_DATA);
  }
}

export class WeatherApiException extends BaseWeatherException {
  constructor(msg: string) {
    super(WEATHER_MESSAGE.API_ERROR(msg));
  }
}

export class MidtermNoDataException extends BaseWeatherException {
  constructor() {
    super(WEATHER_MESSAGE.MIDTERM_NO_DATA);
  }
}

export class DailyForecastNotFoundException extends BaseWeatherException {
  constructor(date: string) {
    super(WEATHER_MESSAGE.DAILY_FORECAST_NOT_FOUND(date));
  }
}

export class WeatherFetchException extends BaseWeatherException {
  constructor() {
    super(WEATHER_MESSAGE.FETCH_ERROR);
  }
}

export class CurrentWeatherFetchException extends BaseWeatherException {
  constructor() {
    super(WEATHER_MESSAGE.CURRENT_FETCH_ERROR);
  }
}

export class MidtermLandNoDataException extends BaseWeatherException {
  constructor() {
    super(WEATHER_MESSAGE.MIDTERM_LAND_NO_DATA);
  }
}

export class MidtermLandEmptyException extends BaseWeatherException {
  constructor() {
    super(WEATHER_MESSAGE.MIDTERM_LAND_EMPTY);
  }
}

export class MidtermLandApiException extends BaseWeatherException {
  constructor(msg: string) {
    super(WEATHER_MESSAGE.MIDTERM_LAND_API_ERROR(msg));
  }
}

export class MidtermTempApiException extends BaseWeatherException {
  constructor(msg: string) {
    super(WEATHER_MESSAGE.MIDTERM_TEMP_API_ERROR(msg));
  }
}

export class MidtermTempEmptyException extends BaseWeatherException {
  constructor() {
    super(WEATHER_MESSAGE.MIDTERM_TEMP_EMPTY);
  }
}

export class MidtermFetchException extends BaseWeatherException {
  constructor() {
    super(WEATHER_MESSAGE.MIDTERM_FETCH_ERROR);
  }
}

export class WeeklyFetchException extends BaseWeatherException {
  constructor() {
    super(WEATHER_MESSAGE.WEEKLY_FETCH_ERROR);
  }
}
