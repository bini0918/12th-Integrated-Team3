import React, { memo } from 'react';
import { NightClouds } from '../../assets';
import type { Location } from '../../types/location';
import { mapCondition, getWeatherIcon } from '../../hooks/weatherHook/useWeatherFormat';

interface WeatherStat {
  label: string;
  value: string;
  unit?: string;
  icon?: React.ReactNode;
}

interface WeatherTagData {
  id: string;
  label: string;
  status: string;
}

export interface WeatherDisplayProps {
  location: Location;
  date?: string;
  temperature?: number;
  weatherStatus?: string;
  stats?: WeatherStat[];
  tags?: WeatherTagData[];
}

const StatItem = memo(({ label, value, unit }: WeatherStat) => (
  <div className="flex items-center gap-1 text-gray-600 font-medium text-sm md:text-base">
    <span className="text-gray-500">{label}</span>
    <span className="text-gray-800 font-bold">
      {value}
      {unit}
    </span>
  </div>
));

const StatusTag = memo(({ label, status }: WeatherTagData) => {
  const bgColor =
    status === '좋음'
      ? 'bg-[#CCE8FF]'
      : status === '보통'
        ? 'bg-[#CEFFCC]'
        : status === '나쁨' || status === '위험'
          ? 'bg-[#FFCCCC]'
          : status === '매우나쁨'
            ? 'bg-[#FF9999]'
            : status.includes(':')
              ? 'bg-[#F6FFCC]'
              : 'bg-gray-200';

  const textColor =
    status === '좋음'
      ? 'text-[#2D7DFF]'
      : status === '보통'
        ? 'text-[#32FF35]'
        : status === '나쁨' || status === '위험'
          ? 'text-[#FF3232]'
          : status === '매우나쁨'
            ? 'text-[#FF0000]'
            : status.includes(':')
              ? 'text-[#FFC532]'
              : 'text-black';

  return (
    <div
      className={`flex flex-col w-32 px-4 py-2 rounded-xl text-sm text-center transition-transform hover:scale-[1.05] ${bgColor}`}
    >
      <span className="opacity-80 text-black text-sm font-medium mb-2">{label}</span>
      <span className={`${textColor} text-sm font-semibold`}>{status}</span>
    </div>
  );
});
//아이콘과 온도를 보여주는 컴포넌트

const WeatherHeader = memo(
  ({
    icon,
    temperature,
    weatherStatus,
  }: {
    icon: string;
    temperature: number;
    weatherStatus: string;
  }) => (
    <div className="flex flex-col items-center gap-3 mb-4">
      <div className="flex items-center gap-4 mb-2">
        <img src={icon} alt="날씨 아이콘" className="w-24 h-24 md:w-32 md:h-32 object-contain" />
        <span className="text-[70px] md:text-[110px] font-extrabold text-black leading-none tracking-tight drop-shadow-sm">
          {Math.round(temperature)}°
        </span>
      </div>
      <div className="text-lg md:text-xl font-bold">{weatherStatus}</div>
    </div>
  ),
);

export default function WeatherDisplay(props: WeatherDisplayProps) {
  const { location } = props;
  const { date, temperature, weatherStatus, stats, tags } = props;

  let icon = '';
  if (weatherStatus) {
    const [timeStr, conditionStr] = weatherStatus.split(' / ');

    const isDay = timeStr === '주간'; // 현재날씨 API 기준
    const code = mapCondition(conditionStr);

    icon = getWeatherIcon(code, isDay);
  }
  return (
    <div className="flex flex-col justify-center items-center w-5xl border-2 border-[#F2F2F2] rounded-2xl bg-[#FFFFFF] p-6 mt-8">
      <div className="w-full text-[20px] font-bold text-black mb-3 p-1.5">
        {date} {location.name} 날씨 현황
      </div>

      {temperature !== undefined && weatherStatus && (
        <WeatherHeader icon={icon} temperature={temperature} weatherStatus={weatherStatus} />
      )}

      <div className="flex flex-wrap justify-center gap-4 md:gap-8 p-4 mb-5">
        {stats?.map((stat, i) => (
          <StatItem key={i} {...stat} />
        ))}
      </div>

      <div className="flex justify-center gap-3 mb-5">
        {tags?.map(tag => (
          <StatusTag key={tag.id} {...tag} />
        ))}
      </div>
    </div>
  );
}
