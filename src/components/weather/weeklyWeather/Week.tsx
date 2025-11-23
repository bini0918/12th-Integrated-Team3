import WeatherCard from './dayCard';
// import { DayClouds, DaySun } from '../../../assets';
import type { Location } from '../../../types/location';
import type { WeeklyWeatherApiResponse } from '../../../api/weather';
import { mapCondition, getWeatherIcon } from '../../../hooks/useWeatherFormat';

interface WeekProps {
  location: Location;
  days: WeeklyWeatherApiResponse['results'];
}

const Week = ({ location, days }: WeekProps) => {
  // API 데이터가 있으면 그걸 사용, 없으면 기존 더미 유지
  // const fallback = [
  //   {
  //     day: '오늘',
  //     date: '4.26',
  //     humidityAm: 10,
  //     humidityPm: 10,
  //     low: 8,
  //     high: 19,
  //     iconAm: DaySun,
  //     iconPm: DayClouds,
  //   },
  //   {
  //     day: '일',
  //     date: '4.27',
  //     humidityAm: 0,
  //     humidityPm: 0,
  //     low: 10,
  //     high: 20,
  //     iconAm: DaySun,
  //     iconPm: DayClouds,
  //   },
  //   {
  //     day: '월',
  //     date: '4.28',
  //     humidityAm: 0,
  //     humidityPm: 0,
  //     low: 9,
  //     high: 20,
  //     iconAm: DaySun,
  //     iconPm: DayClouds,
  //   },
  //   {
  //     day: '화',
  //     date: '4.29',
  //     humidityAm: 0,
  //     humidityPm: 40,
  //     low: 8,
  //     high: 19,
  //     iconAm: DaySun,
  //     iconPm: DayClouds,
  //   },
  //   {
  //     day: '수',
  //     date: '4.30',
  //     humidityAm: 10,
  //     humidityPm: 10,
  //     low: 12,
  //     high: 22,
  //     iconAm: DaySun,
  //     iconPm: DayClouds,
  //   },
  // ];

  const hasData = days && days.length > 0;

  const mapped = hasData
    ? days.map(d => {
        const amCode = mapCondition(d.amCondition);
        const pmCode = mapCondition(d.pmCondition);

        const amIcon = getWeatherIcon(amCode, true); // 오전 → 낮으로 처리
        const pmIcon = getWeatherIcon(pmCode, false); // 오후 → 밤

        return {
          day: d.day,
          humidityAm: d.amHumidity ?? 0,
          humidityPm: d.pmHumidity ?? 0,
          low: d.amMinTemp,
          high: d.pmMaxTemp,
          iconAm: amIcon,
          iconPm: pmIcon,
        };
      })
    : [];

  return (
    <div className="w-5xl border-2 border-[#F2F2F2] rounded-2xl bg-[#FFFFFF] p-6 mb-8">
      <h2 className="text-[20px] font-bold text-black mb-3">{location.name} 주간 예보</h2>

      {!hasData && <p className="text-center text-gray-500">주간 예보 데이터가 없습니다.</p>}

      {!hasData && (
        <div className="flex items-end justify-between">
          {mapped.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="flex gap-2">
                <WeatherCard
                  icon={item.iconAm}
                  humidity={item.humidityAm}
                  time="오전"
                  temp={Math.round(item.low)}
                />
                <WeatherCard
                  icon={item.iconPm}
                  humidity={item.humidityPm}
                  time="오후"
                  temp={Math.round(item.high)}
                />
              </div>

              <div className="flex flex-col items-center gap-0.5">
                <span className="text-sm font-normal text-gray-700">{item.day}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Week;
