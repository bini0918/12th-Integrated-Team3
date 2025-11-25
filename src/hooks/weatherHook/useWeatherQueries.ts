// src/hooks/useWeatherQueries.ts
import { useQuery } from '@tanstack/react-query';
import {
  getCurrentWeather,
  getHourlyWeather,
  getWeeklyWeather,
  type CurrentWeatherApiResponse,
  type HourlyWeatherApiResponse,
  type WeeklyWeatherApiResponse,
} from '../../api/weather';

/*
현재 날씨 조회
- 백엔드 명세: GET /api/v1/weather/current?locationId={id}
*/
export function useCurrentWeather(locationId?: number) {
  return useQuery<CurrentWeatherApiResponse>({
    queryKey: ['weather', 'current', locationId],
    queryFn: () => {
      if (locationId == null) {
        throw new Error('위치 ID가 없습니다.');
      }
      return getCurrentWeather(locationId);
    },
    enabled: locationId != null,
  });
}

/*
시간대(시간별) 날씨 조회
- 백엔드 명세: GET /api/v1/weather/hourly?locationId={id}
- 3시간 간격 데이터를 받아와서 24시간(8개) 분량만 잘라서 반환
*/
export function useHourlyWeather(locationId?: number) {
  return useQuery<HourlyWeatherApiResponse>({
    queryKey: ['weather', 'hourly', locationId],
    queryFn: () => {
      if (locationId == null) {
        throw new Error('위치 ID가 없습니다.');
      }
      return getHourlyWeather(locationId);
    },
    enabled: locationId != null,
  });
}

/*
주간 날씨 조회
- 백엔드 명세: GET /api/v1/weather/weekly?locationId={id}
*/
export function useWeeklyWeather(locationId?: number) {
  return useQuery<WeeklyWeatherApiResponse>({
    queryKey: ['weather', 'weekly', locationId],
    queryFn: () => {
      if (locationId == null) {
        throw new Error('위치 ID가 없습니다.');
      }
      return getWeeklyWeather(locationId);
    },
    enabled: locationId != null,
  });
}
