// src/modules/weather/utils/kma-coordinate.util.ts
import { Logger } from '@nestjs/common';

const logger = new Logger('KmaCoordinateUtil');

// 기상청 위경도-격자 좌표 변환 상수
const RE = 6371.00877; // 지구 반경 (km)
const GRID = 5.0;     // 격자 간격 (km)
const SLAT1 = 30.0;   // 표준 위도1
const SLAT2 = 60.0;   // 표준 위도2
const OLON = 126.0;   // 기준점 경도
const OLAT = 38.0;    // 기준점 위도
const XO = 43;        // 기준점 X좌표
const YO = 136;       // 기준점 Y좌표

export interface KmaGrid {
  nx: number;
  ny: number;
}

export class KmaCoordinateUtil {
  /**
   * 위도/경도 좌표를 기상청 격자 좌표(nx, ny)로 변환합니다.
   */
  static convertLatLngToKmaGrid(lat: number, lng: number): KmaGrid {
    const degrad = Math.PI / 180.0;
    const re = RE / GRID;
    const slat1 = SLAT1 * degrad;
    const slat2 = SLAT2 * degrad;
    const olon = OLON * degrad;
    const olat = OLAT * degrad;

    let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
    let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = re * sf / Math.pow(ro, sn);

    let ra = Math.tan(Math.PI * 0.25 + (lat * degrad) * 0.5);
    ra = re * sf / Math.pow(ra, sn);
    let theta = lng * degrad - olon;
    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= sn;

    const nx = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    const ny = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

    logger.debug(`위도/경도(${lat}, ${lng})를 격자 좌표(${nx}, ${ny})로 변환`);
    return { nx, ny };
  }

  /**
   * 쿼리 파라미터에서 위도/경도를 추출하여 기상청 격자 좌표로 변환합니다.
   */
   static getKmaGridFromQuery(query: { latitude?: number; longitude?: number }): { nx: number, ny: number } {
    if (query.latitude && query.longitude) {
      return KmaCoordinateUtil.convertLatLngToKmaGrid(query.latitude, query.longitude);
    }
    // 기본값 (부산 중구)
    return { nx: 98, ny: 76 };
  }
}