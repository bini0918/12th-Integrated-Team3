import * as Icons from '../assets';

// 내부 공통 날씨 코드
export type WeatherCode =
  | 'CLEAR'
  | 'PARTLY_CLOUDY'
  | 'CLOUDY'
  | 'OVERCAST'
  | 'RAIN'
  | 'SNOW'
  | 'STORM'
  | 'WIND'
  | 'UNKNOWN';

// 1. API 상태 → 내부 코드 변환 테이블
const conditionMap: Record<string, WeatherCode> = {
  // 영어 기반
  'clear sky': 'CLEAR',
  'few clouds': 'PARTLY_CLOUDY',
  'scattered clouds': 'PARTLY_CLOUDY',
  'broken clouds': 'CLOUDY',
  'overcast clouds': 'OVERCAST',

  rain: 'RAIN',
  'light rain': 'RAIN',
  'moderate rain': 'RAIN',

  snow: 'SNOW',
  'light snow': 'SNOW',

  storm: 'STORM',
  thunderstorm: 'STORM',

  wind: 'WIND',

  // 한국어 기반(현재날씨 API)
  맑음: 'CLEAR',
  흐림: 'CLOUDY',
  구름많음: 'PARTLY_CLOUDY',
  비: 'RAIN',
  눈: 'SNOW',

  // 정보 없음
  정보없음: 'UNKNOWN',
};

// 2. 아이콘 매핑
const iconMap: Record<'day' | 'night', Record<WeatherCode, string>> = {
  day: {
    CLEAR: Icons.DaySun,
    PARTLY_CLOUDY: Icons.DayClouds,
    CLOUDY: Icons.DayClouds,
    OVERCAST: Icons.DayClouds,
    RAIN: Icons.DayRain,
    SNOW: Icons.DaySnow,
    STORM: Icons.DayStorm,
    WIND: Icons.DayWind,
    UNKNOWN: Icons.DayClouds,
  },
  night: {
    CLEAR: Icons.NightMoon,
    PARTLY_CLOUDY: Icons.NightClouds,
    CLOUDY: Icons.NightClouds,
    OVERCAST: Icons.NightClouds,
    RAIN: Icons.NightRain,
    SNOW: Icons.NightSnow,
    STORM: Icons.NightStorm,
    WIND: Icons.NightWind,
    UNKNOWN: Icons.NightClouds,
  },
};

// 3. 상태 문자열 → WeatherCode 변환
export function mapCondition(raw: string | undefined | null): WeatherCode {
  if (!raw) return 'UNKNOWN';

  const key = raw.toLowerCase().trim();
  return conditionMap[key] ?? 'UNKNOWN';
}

// 4. 시간 기반 day/night 판단
export function isDayTime(hourString: string): boolean {
  // "18시" → 18
  const hour = parseInt(hourString.replace('시', ''), 10);

  return hour >= 6 && hour < 18; // 06~17 → Day, 나머지 → Night
}

// 5. WeatherCode + day/night → 아이콘 반환
export function getWeatherIcon(code: WeatherCode, isDay: boolean): string {
  return iconMap[isDay ? 'day' : 'night'][code];
}

// 6. Kelvin → Celsius 변환, 시간대별 json 보니깐 온도가 켈빈으로 되어있어서 일단 추가했습니다.
export function kelvinToCelsius(k: number): number {
  return Math.round(k - 273.15);
}
