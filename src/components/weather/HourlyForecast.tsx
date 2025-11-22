import { useState } from 'react';
import type { Location } from '../../types/location';
import { next } from '../../assets';
//import * as Icons from '../../assets';

// 통합 날씨 매핑 유틸
import { mapCondition, isDayTime, getWeatherIcon } from '../../hooks/useWeatherFormat';

type HourItem = {
  hour: string; // "18시"
  tempC: number; // 섭씨
  condition: string; // "흐림", "few clouds"
  icon?: string; // 서버 제공 icon
};

// const hours = [
//   {
//     time: '03시',
//     temp: '8°',
//     icon: <img src={Icons.NightClouds} alt="night clouds" className="w-8 h-8" />,
//   },
//   {
//     time: '04시',
//     temp: '8°',
//     icon: <img src={Icons.NightMoon} alt="night moon" className="w-8 h-8" />,
//   },
//   {
//     time: '05시',
//     temp: '8°',
//     icon: <img src={Icons.NightWind} alt="night wind" className="w-8 h-8" />,
//   },
//   {
//     time: '06시',
//     temp: '8°',
//     icon: <img src={Icons.NightClouds} alt="night clouds" className="w-8 h-8" />,
//   },
//   {
//     time: '07시',
//     temp: '8°',
//     icon: <img src={Icons.NightClouds} alt="night clouds" className="w-8 h-8" />,
//   },
//   {
//     time: '08시',
//     temp: '8°',
//     icon: <img src={Icons.NightClouds} alt="night clouds" className="w-8 h-8" />,
//   },
//   {
//     time: '09시',
//     temp: '8°',
//     icon: <img src={Icons.NightClouds} alt="night clouds" className="w-8 h-8" />,
//   },
//   {
//     time: '10시',
//     temp: '8°',
//     icon: <img src={Icons.NightClouds} alt="night clouds" className="w-8 h-8" />,
//   },
//   {
//     time: '11시',
//     temp: '8°',
//     icon: <img src={Icons.NightClouds} alt="night clouds" className="w-8 h-8" />,
//   },
//   {
//     time: '12시',
//     temp: '8°',
//     icon: <img src={Icons.NightClouds} alt="night clouds" className="w-8 h-8" />,
//   },
//   {
//     time: '13시',
//     temp: '8°',
//     icon: <img src={Icons.NightClouds} alt="night clouds" className="w-8 h-8" />,
//   },
//   {
//     time: '14시',
//     temp: '8°',
//     icon: <img src={Icons.NightClouds} alt="night clouds" className="w-8 h-8" />,
//   },
//   {
//     time: '15시',
//     temp: '8°',
//     icon: <img src={Icons.NightClouds} alt="night clouds" className="w-8 h-8" />,
//   },
//   {
//     time: '16시',
//     temp: '8°',
//     icon: <img src={Icons.NightMoon} alt="night moon" className="w-8 h-8" />,
//   },
//   {
//     time: '17시',
//     temp: '8°',
//     icon: <img src={Icons.NightWind} alt="night wind" className="w-8 h-8" />,
//   },
//   {
//     time: '18시',
//     temp: '8°',
//     icon: <img src={Icons.NightClouds} alt="night clouds" className="w-8 h-8" />,
//   },
//   {
//     time: '19시',
//     temp: '8°',
//     icon: <img src={Icons.NightClouds} alt="night clouds" className="w-8 h-8" />,
//   },
//   {
//     time: '20시',
//     temp: '8°',
//     icon: <img src={Icons.NightClouds} alt="night clouds" className="w-8 h-8" />,
//   },
//   {
//     time: '21시',
//     temp: '8°',
//     icon: <img src={Icons.NightClouds} alt="night clouds" className="w-8 h-8" />,
//   },
//   {
//     time: '22시',
//     temp: '8°',
//     icon: <img src={Icons.NightClouds} alt="night clouds" className="w-8 h-8" />,
//   },
//   {
//     time: '23시',
//     temp: '8°',
//     icon: <img src={Icons.NightClouds} alt="night clouds" className="w-8 h-8" />,
//   },
//   {
//     time: '24시',
//     temp: '8°',
//     icon: <img src={Icons.NightClouds} alt="night clouds" className="w-8 h-8" />,
//   },
//   {
//     time: '01시',
//     temp: '8°',
//     icon: <img src={Icons.NightClouds} alt="night clouds" className="w-8 h-8" />,
//   },
//   {
//     time: '02시',
//     temp: '8°',
//     icon: <img src={Icons.NightClouds} alt="night clouds" className="w-8 h-8" />,
//   },
// ];

type HourlyForecastProps = {
  location: Location;
  hours: HourItem[];
};

const HOURS_PER_PAGE = 12;

const HourlyForecast = ({ location, hours }: HourlyForecastProps) => {
  const [startIndex, setStartIndex] = useState(0);

  const visibleHours = hours.slice(startIndex, startIndex + HOURS_PER_PAGE);

  const handleNext = () => {
    setStartIndex(prev => {
      const next = prev + HOURS_PER_PAGE;
      return next >= hours.length ? 0 : next;
    });
  };

  return (
    <div className="w-5xl h-50 border-2 border-[#F2F2F2] rounded-2xl bg-[#FFFFFF]">
      <h2 className="text-[20px] font-bold text-black mt-3 ml-5 p-1.5">
        {location.name} 시간별 현황
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
          className="absolute mt-2 right-3 top-1/2 -translate-y-1/2 cursor-pointer"
        >
          <img
            src={next}
            alt="next"
            className="right-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
          />
        </button>
      </div>
      {/* 실제 시간대 UI */}
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
