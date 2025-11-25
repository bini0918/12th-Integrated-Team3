const BASE = '/api/v1/weather';

export interface CurrentWeatherApiResponse {
  results: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    condition: string;
    time: string;
    sunrise: string;
    airQuality: {
      pm10: string;
      pm2_5: string;
    };
  };
}

export interface HourlyWeatherApiResponse {
  results: Array<{
    hour: string;
    temperature: number;
    condition: string;
    icon: string;
  }>;
}

export interface WeeklyWeatherApiResponse {
  results: Array<{
    day: string;
    amCondition: string;
    amMinTemp: number;
    amMaxTemp: number;
    pmCondition: string;
    pmMinTemp: number;
    pmMaxTemp: number;
    amHumidity?: number;
    pmHumidity?: number;
  }>;
}

/*
- 현재 날씨 조회
-> GET /api/v1/weather/current?locationId={id}
 */
export async function getCurrentWeather(locationId: number) {
  const res = await fetch(`${BASE}/current?locationId=${locationId}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error(`현재 날씨 조회 실패: ${res.status}`);
  }
  return res.json() as Promise<CurrentWeatherApiResponse>;
}

/*
- 시간대 날씨 조회
-> GET /api/v1/weather/hourly?locationId={id}
 */
export async function getHourlyWeather(locationId: number) {
  const res = await fetch(`${BASE}/hourly?locationId=${locationId}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error(`시간대 날씨 조회 실패: ${res.status}`);
  }

  return res.json() as Promise<HourlyWeatherApiResponse>;
}

/*
- 주간 날씨 조회
-> GET /api/v1/weather/weekly?locationId={id}
 */
export async function getWeeklyWeather(locationId: number) {
  const res = await fetch(`${BASE}/weekly?locationId=${locationId}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error(`주간 날씨 조회 실패: ${res.status}`);
  }

  return res.json() as Promise<WeeklyWeatherApiResponse>;
}
