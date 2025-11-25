import { useState } from 'react';
import type { Location } from '../../types/location';
import { next } from '../../assets';
import { mapCondition, isDayTime, getWeatherIcon } from '../../hooks/weatherHook/useWeatherFormat';

type HourItem = {
  hour: string;
  tempC: number;
  condition: string;
  icon?: string;
};

type HourlyForecastProps = {
  location: Location;
  hours: HourItem[];
};

const HOURS_PER_PAGE = 4;

const HourlyForecast = ({ location, hours }: HourlyForecastProps) => {
  const [startIndex, setStartIndex] = useState(0);

  const visibleHours = hours.slice(startIndex, startIndex + HOURS_PER_PAGE);

  const handleNext = () => {
    setStartIndex(prev => {
      const nextIdx = prev + HOURS_PER_PAGE;
      return nextIdx >= hours.length ? 0 : nextIdx;
    });
  };

  return (
    <div className="w-full max-w-5xl border-2 border-[#F2F2F2] rounded-2xl bg-[#FFFFFF]">
      <h2 className="text-[20px] font-bold text-black mt-3 ml-5 p-1.5">
        {location.name} 시간대별 현황
      </h2>
      <div className="relative mt-7 mb-4">
        <div className="pointer-events-none absolute inset-x-13 top-1/2 h-px -translate-y-1/2 bg-gray-200" />

        <div className="flex items-center justify-between px-13">
          {visibleHours.map(h => (
            <div key={h.hour} className="flex flex-col items-center">
              <div className="z-10 h-2 w-2 rounded-full bg-gray-300" />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleNext}
          className="absolute mt-2 right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
        >
          <img src={next} alt="next" className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center justify-between px-10 pb-5">
        {visibleHours.map(h => {
          const code = mapCondition(h.condition);
          const dayFlag = isDayTime(h.hour);
          const icon = getWeatherIcon(code, dayFlag);

          return (
            <div key={h.hour} className="flex flex-col items-center gap-1">
              <img src={icon} alt={h.condition} className="w-8 h-8" />
              <div className="text-xs text-gray-500">{h.hour}</div>
              <div className="text-xs font-semibold text-gray-700">{h.tempC}°</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;
