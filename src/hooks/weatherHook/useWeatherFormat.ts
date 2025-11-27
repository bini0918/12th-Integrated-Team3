import * as Icons from '../../assets';

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

const conditionMap: Record<string, WeatherCode> = {
  // Clear
  'clear sky': 'CLEAR',
  sunny: 'CLEAR',
  맑음: 'CLEAR',

  // Clouds
  'few clouds': 'PARTLY_CLOUDY',
  'scattered clouds': 'PARTLY_CLOUDY',
  'broken clouds': 'CLOUDY',
  'overcast clouds': 'OVERCAST',
  구름조금: 'PARTLY_CLOUDY',
  구름많음: 'PARTLY_CLOUDY',
  '구름 많음': 'PARTLY_CLOUDY',
  흐림: 'CLOUDY',

  // Atmosphere (Mist, Fog, etc.)
  mist: 'CLOUDY',
  fog: 'CLOUDY',
  haze: 'CLOUDY',
  '옅은 안개': 'CLOUDY',
  '짙은 안개': 'OVERCAST',
  실안개: 'CLOUDY',
  먼지: 'CLOUDY',
  황사: 'CLOUDY',
  연기: 'CLOUDY',
  화산재: 'CLOUDY',

  // Rain
  rain: 'RAIN',
  'light rain': 'RAIN',
  'moderate rain': 'RAIN',
  'heavy rain': 'RAIN',
  'shower rain': 'RAIN',
  'patchy rain nearby': 'RAIN',
  비: 'RAIN',
  이슬비: 'RAIN',
  소나기: 'RAIN',

  // Snow
  snow: 'SNOW',
  'light snow': 'SNOW',
  'heavy snow': 'SNOW',
  sleet: 'SNOW',
  눈: 'SNOW',
  진눈깨비: 'SNOW',
  우박: 'SNOW',

  // Storm
  storm: 'STORM',
  thunderstorm: 'STORM',
  천둥번개: 'STORM',
  뇌우: 'STORM',

  // Wind
  wind: 'WIND',
  breeze: 'WIND',
  gale: 'WIND',
  바람: 'WIND',
  돌풍: 'WIND',
  토네이도: 'WIND',

  // Etc
  정보없음: 'UNKNOWN',
};

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

  // 1. 정확한 매핑 확인
  if (conditionMap[key]) {
    return conditionMap[key];
  }

  // 2. 키워드 포함 여부로 매핑

  // (1) 뇌우/폭풍
  if (
    key.includes('storm') ||
    key.includes('thunder') ||
    key.includes('천둥') ||
    key.includes('번개') ||
    key.includes('뇌우')
  ) {
    return 'STORM';
  }

  // (2) 눈 (비보다 우선순위를 높게 두거나 비슷하게 처리)
  if (
    key.includes('snow') ||
    key.includes('sleet') ||
    key.includes('blizzard') ||
    key.includes('hail') ||
    key.includes('눈')
  ) {
    return 'SNOW';
  }

  // (3) 비
  if (
    key.includes('rain') ||
    key.includes('shower') ||
    key.includes('drizzle') ||
    key.includes('비')
  ) {
    return 'RAIN';
  }

  // (4) 흐림 (Overcast)
  if (key.includes('overcast') || key.includes('짙은 안개')) {
    return 'OVERCAST';
  }

  // (5) 구름 조금/많음 (Partly)
  if (
    key.includes('partly') ||
    key.includes('few') ||
    key.includes('scattered') ||
    key.includes('broken') ||
    key.includes('구름많') ||
    key.includes('구름 많') ||
    key.includes('구름조')
  ) {
    return 'PARTLY_CLOUDY';
  }

  // (6) 일반적인 흐림/안개
  if (
    key.includes('cloud') ||
    key.includes('fog') ||
    key.includes('mist') ||
    key.includes('haze') ||
    key.includes('흐림') ||
    key.includes('안개') ||
    key.includes('먼지')
  ) {
    return 'CLOUDY';
  }

  // (7) 바람
  if (
    key.includes('wind') ||
    key.includes('gale') ||
    key.includes('gust') ||
    key.includes('바람') ||
    key.includes('돌풍')
  ) {
    return 'WIND';
  }

  // (8) 맑음
  if (key.includes('clear') || key.includes('sunny') || key.includes('맑음')) {
    return 'CLEAR';
  }

  return 'UNKNOWN';
}

// 4. 시간 기반 day/night 판단
export function isDayTime(hourString: string): boolean {
  if (!hourString) return true;
  const str = hourString.trim();

  // 명시적 문자열 우선 처리
  if (str === '주간' || str.toLowerCase() === 'day') return true;
  if (str === '야간' || str.toLowerCase() === 'night') return false;

  let hour = -1;
  // 숫자만 있거나, 구분자(:, 시) 앞의 숫자 추출
  const match = str.match(/(\d{1,2})(?=:|시)/);

  if (match) {
    hour = parseInt(match[1], 10);
  } else {
    // "14" 같은 순수 숫자 스트링 처리
    hour = parseInt(str, 10);
  }

  if (isNaN(hour)) return true;

  if (hour > 24) hour = Math.floor(hour / 100);

  // 06시 ~ 17시 → Day(낮), 18시 ~ 05시 → Night(밤)
  return hour >= 6 && hour < 18;
}

// 5. 아이콘 반환
export function getWeatherIcon(code: WeatherCode, isDay: boolean): string {
  const timeKey = isDay ? 'day' : 'night';
  return iconMap[timeKey][code] || iconMap[timeKey]['UNKNOWN'];
}

// 6. 켈빈 → 섭씨 변환
export function kelvinToCelsius(k: number): number {
  return Math.round(k - 273.15);
}
