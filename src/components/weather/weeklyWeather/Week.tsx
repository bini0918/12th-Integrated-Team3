import WeatherCard from './dayCard';
import type { Location } from '../../../types/location';
import type { WeeklyWeatherApiResponse } from '../../../api/weather';
import { mapCondition, getWeatherIcon } from '../../../hooks/weatherHook/useWeatherFormat';

interface WeekProps {
  location: Location;
  days: WeeklyWeatherApiResponse['results'];
}

const Week = ({ location, days }: WeekProps) => {
  const hasData = days && days.length > 0;

  const fiveDays = hasData ? days.slice(0, 5) : [];

  const mapped = hasData
    ? fiveDays.map((d, index) => {
        const amCode = mapCondition(d.amCondition);
        const pmCode = mapCondition(d.pmCondition);

        const amIcon = getWeatherIcon(amCode, true);
        const pmIcon = getWeatherIcon(pmCode, false);

        const date = new Date();
        date.setDate(date.getDate() + index);
        const dateString = `${date.getMonth() + 1}.${date.getDate()}`;

        return {
          day: d.day,
          date: dateString,
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
      <h2 className="text-[20px] font-bold text-black mb-3 ml-1">{location.name} 주간 예보</h2>

      {!hasData && (
        <div className="py-10 text-center text-gray-500">주간 예보 데이터가 없습니다.</div>
      )}

      {hasData && (
        <div className="flex items-end justify-between overflow-x-auto pb-2">
          {mapped.map((item, idx) => (
            <div key={`${item.day}-${idx}`} className="flex flex-col items-center min-w-[100px]">
              <div className="flex gap-1">
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

              <div className="text-center flex flex-col items-center mt-3 font-normal text-black text-4">
                <span className="text-sm">{item.day}</span>
                <span className="mt-1">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Week;
