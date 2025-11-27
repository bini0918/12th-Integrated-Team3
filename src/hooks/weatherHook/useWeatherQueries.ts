import { useSuspenseQuery } from '@tanstack/react-query';
import {
  getCurrentWeather,
  getHourlyWeather,
  getWeeklyWeather,
  type CurrentWeatherApiResponse,
  type HourlyWeatherApiResponse,
  type WeeklyWeatherApiResponse,
} from '../../api/weather';
export function useCurrentWeather(locationId: number) {
  return useSuspenseQuery<CurrentWeatherApiResponse>({
    queryKey: ['weather', 'current', locationId],
    queryFn: () => getCurrentWeather(locationId),
  });
}

export function useHourlyWeather(locationId: number) {
  return useSuspenseQuery<HourlyWeatherApiResponse>({
    queryKey: ['weather', 'hourly', locationId],
    queryFn: () => getHourlyWeather(locationId),
  });
}

export function useWeeklyWeather(locationId: number) {
  return useSuspenseQuery<WeeklyWeatherApiResponse>({
    queryKey: ['weather', 'weekly', locationId],
    queryFn: () => getWeeklyWeather(locationId),
  });
}
