import { useCurrentWeather, useHourlyWeather, useWeeklyWeather } from './useWeatherQueries';
import { kelvinToCelsius } from './useWeatherFormat';

export function useWeatherViewModel(locationId: number) {
  const { data: current } = useCurrentWeather(locationId);
  const { data: hourly } = useHourlyWeather(locationId);
  const { data: weekly } = useWeeklyWeather(locationId);

  // 1. 현재 날씨 UI 데이터 가공
  const weatherDisplayProps = {
    date: new Date().toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
    }),
    temperature: current.results.temperature,
    weatherStatus: `${current.results.time} / ${current.results.condition}`,
    stats: [
      { label: '체감', value: current.results.feelsLike.toFixed(1), unit: 'º' },
      { label: '습도', value: String(current.results.humidity), unit: '%' },
      {
        label: current.results.windDirection,
        value: current.results.windSpeed.toFixed(1),
        unit: 'm/s',
      },
    ],
    tags: [
      { id: 'pm10', label: '미세먼지', status: current.results.airQuality.pm10 },
      { id: 'pm2_5', label: '초미세먼지', status: current.results.airQuality.pm2_5 },
      { id: 'uv', label: '자외선', status: '보통' }, // API 데이터 없음 (임의)
      { id: 'sunrise', label: '일출', status: current.results.sunrise },
    ],
  };

  // 2. 시간별 날씨 데이터 가공
  const hourlyItems = hourly.results.map(r => ({
    hour: r.hour,
    tempC: kelvinToCelsius(r.temperature),
    condition: r.condition,
    icon: r.icon,
  }));

  // 3. 주간 날씨 데이터
  const weeklyItems = weekly.results;

  return {
    weatherDisplayProps,
    hourlyItems,
    weeklyItems,
  };
}
