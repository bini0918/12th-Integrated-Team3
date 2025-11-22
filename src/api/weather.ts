const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface CurrentWeatherApiResponse {
  code: string;
  message: string;
  success: boolean;
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
  code: string;
  message: string;
  success: boolean;
  results: Array<{
    hour: string;
    temperature: number;
    condition: string;
    icon: string;
  }>;
}

export interface WeeklyWeatherApiResponse {
  code: string;
  message: string;
  success: boolean;
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
//credential 이용
async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error(`HTTP Error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

/*
- 현재 날씨 조회
-> GET /api/v1/weather/current?locationId={id}
 */
export function getCurrentWeather(locationId: number) {
  return fetchJson<CurrentWeatherApiResponse>(
    `${API_BASE_URL}/api/v1/weather/current?locationId=${locationId}`,
  );
}

/*
- 시간대 날씨 조회
-> GET /api/v1/weather/hourly-status?locationId={id}
 */
export function getHourlyWeather(locationId: number) {
  return fetchJson<HourlyWeatherApiResponse>(
    `${API_BASE_URL}/api/v1/weather/hourly-status?locationId=${locationId}`,
  );
}

/*
- 주간 날씨 조회
-> GET /api/v1/weather/weekly-status?locationId={id}
 */
export function getWeeklyWeather(locationId: number) {
  return fetchJson<WeeklyWeatherApiResponse>(
    `${API_BASE_URL}/api/v1/weather/weekly-status?locationId=${locationId}`,
  );
}
