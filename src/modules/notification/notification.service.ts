// src/modules/notification/notification.service.ts
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { NOTIFICATION_STATUS } from "./constants/notification-status";
import { v4 as uuidv4 } from 'uuid';
import { WeatherResponseDto } from '../weather/dto/weather-response.dto';
import { WeatherService } from '../weather/services/weather.service';
import { WebsocketService } from '../websocket/websocket.service';
import { NotificationMessageDto } from './dto/notification-message.dto';


@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  // 알림을 보낼 기본 위치 (예: 부산 중구)
  private readonly DEFAULT_LAT = 35.10278;
  private readonly DEFAULT_LON = 129.04028;

  constructor(
    private readonly weatherService: WeatherService,
    private readonly websocketService: WebsocketService,
  ) {}

  /**
   * 날씨 정보를 기반으로 알림 메시지를 생성하고 웹소켓으로 전송합니다.
   * 특정 위치(nx, ny)에 대한 알림을 생성합니다.
   */
   async sendWeatherNotification(lat: number = this.DEFAULT_LAT, lon: number = this.DEFAULT_LON): Promise<void> {
    try {
      this.logger.log(`날씨 알림 생성 시작: lat=${lat}, lon=${lon}`);

      // WeatherService의 getCurrentWeather 사용
      const weatherData = await this.weatherService.getCurrentWeather(lat, lon);

      const weatherResponse = WeatherResponseDto.fromWeatherDataDto(weatherData);

      // 날씨 상태에 따른 메시지 생성
      const notification = this.createWeatherNotification(weatherResponse);

      // 웹소켓으로 알림 전송
      await this.websocketService.sendNotification(notification);

      this.logger.log(`날씨 알림 전송 완료: ${notification.title} (lat=${lat}, lon=${lon})`);
    } catch (error) {
      this.logger.error(`날씨 알림 생성 중 오류 발생: ${error.message}`, error.stack);
      throw new InternalServerErrorException('날씨 알림을 생성하는 중 오류가 발생했습니다.');
    }
  }

  /**
   * 날씨 데이터를 기반으로 알림 메시지를 생성합니다.
   * WeatherResponseDto를 인자로 받도록 수정
   */
  private createWeatherNotification(weatherForecast: WeatherResponseDto): NotificationMessageDto {
    const today = new Date();
    const currentHour = today.getHours();
    
    let title = '오늘의 날씨 안내';
    let message = '';
    let imageUrl = '';
    
    // 오전/오후 날씨 상태를 기준으로 메시지 생성
    const isAm = currentHour < 12; // 현재 시간이 오전인지 오후인지 (대략적으로)
    const weatherCondition = isAm ? weatherForecast.amWeatherCondition : weatherForecast.pmWeatherCondition;
    const precipitationProb = isAm ? weatherForecast.amPrecipitationProb : weatherForecast.pmPrecipitationProb;
    const minTemp = weatherForecast.minTemperature;
    const maxTemp = weatherForecast.maxTemperature;

    // 강수 확률에 따른 메시지
    if (precipitationProb >= 60) {
      title = '☔ 우산 챙기세요!';
      message = `오늘은 ${weatherCondition}이고 비가 올 확률이 ${precipitationProb}%입니다. 우산 꼭 챙기세요! 우모 서비스가 당신을 기다립니다.`;
      imageUrl = '/assets/images/rain_umbrella.png';
    } else if (precipitationProb >= 30) {
      title = '☁️ 비 소식 있어요!';
      message = `오늘은 ${weatherCondition}이고 비가 올 수도 있어요 (강수확률 ${precipitationProb}%). 가벼운 우산이나 우모 서비스를 이용해보세요!`;
      imageUrl = '/assets/images/cloudy_rain.png';
    } else {
      // 강수 확률이 낮을 때 기온에 따른 메시지
      if (maxTemp >= 30) {
        title = '☀️ 더위 조심하세요!';
        message = `오늘은 ${weatherCondition}이고 최고 기온 ${maxTemp}℃로 매우 덥습니다. 시원한 우모 우산으로 햇빛을 가려보세요!`;
        imageUrl = '/assets/images/sunny_hot.png';
      } else if (maxTemp >= 25) {
        title = '맑고 쾌청한 하루!';
        message = `오늘은 ${weatherCondition}이고 최고 기온 ${maxTemp}℃입니다. 산책하기 좋은 날씨네요!`;
        imageUrl = '/assets/images/sunny.png';
      } else if (minTemp <= 5) {
        title = '🥶 옷 따뜻하게 입으세요!';
        message = `오늘은 ${weatherCondition}이고 최저 기온 ${minTemp}℃로 쌀쌀합니다. 감기 조심하세요!`;
        imageUrl = '/assets/images/cold.png';
      } else {
        title = '🌿 쾌적한 날씨!';
        message = `오늘은 ${weatherCondition}이고 기온은 ${minTemp}~${maxTemp}℃입니다. 우모와 함께 즐거운 하루 보내세요!`;
        imageUrl = '/assets/images/pleasant.png';
      }
    }
    
    return {
      id: uuidv4(), // UUID 생성
      type: NOTIFICATION_STATUS.WEATHER,
      title,
      message,
      imageUrl,
      createdAt: new Date(),
      data: weatherForecast, // 원본 날씨 데이터도 함께 전송
    };
  }
}