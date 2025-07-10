// src/modules/weather/region/region.service.ts
import { Injectable } from '@nestjs/common';
import { REGION_MAPPINGS, findRegIdBySido } from 'src/common/constants/region-mappings';
import { KmaCoordinateUtil } from 'src/modules/weather/utils/kma-coordinate.util';

interface GridRegion {
  nxRange: [number, number];
  nyRange: [number, number];
  regId: string;
}

// 격자 좌표 기반 간단 매핑 예시 (정밀하게는 DB 필요)
const GRID_REGION_MAPPINGS: GridRegion[] = [
  // 수도권 (서울, 경기, 인천 포함)
  { nxRange: [55, 65], nyRange: [120, 135], regId: '11B00000' },
  // 충청북도, 세종
  { nxRange: [60, 70], nyRange: [110, 120], regId: '11C10000' },
  // 충청남도, 대전
  { nxRange: [65, 75], nyRange: [105, 115], regId: '11C20000' },
  // 강원도 영서 (서쪽)
  { nxRange: [70, 80], nyRange: [130, 140], regId: '11D10000' },
  // 강원도 영동 (동쪽)
  { nxRange: [85, 95], nyRange: [130, 140], regId: '11D20000' },
  // 전라북도
  { nxRange: [50, 60], nyRange: [95, 105], regId: '11F10000' },
  // 전라남도, 광주
  { nxRange: [45, 55], nyRange: [85, 95], regId: '11F20000' },
  // 제주도
  { nxRange: [30, 35], nyRange: [70, 75], regId: '11G00000' },
  // 경상북도, 대구
  { nxRange: [75, 85], nyRange: [90, 105], regId: '11H10000' },
  // 경상남도, 부산, 울산
  { nxRange: [90, 105], nyRange: [70, 85], regId: '11H20000' },
  // 울릉도
  { nxRange: [110, 115], nyRange: [110, 115], regId: '11E00000' },
  // 백령도 (인천 옹진군)
  { nxRange: [45, 50], nyRange: [135, 140], regId: '11A00000' },
];

@Injectable()
export class RegionService {
  /**
   * 시도 + 구군명으로 regId 조회 (기존 매핑 활용)
   */
  getRegionCodeByName(sido: string, gugun?: string): string | null {
    return findRegIdBySido(sido, gugun);
  }

  /**
   * 위경도 → 기상청 격자좌표 → 격자 범위 매핑 → regId 반환
   */
  getRegionCodeByCoordinate(lat: number, lon: number): string | null {
    const { nx, ny } = KmaCoordinateUtil.convertLatLngToKmaGrid(lat, lon);

    for (const region of GRID_REGION_MAPPINGS) {
      if (
        nx >= region.nxRange[0] && nx <= region.nxRange[1] &&
        ny >= region.nyRange[0] && ny <= region.nyRange[1]
      ) {
        return region.regId;
      }
    }
    return null;
  }
}
