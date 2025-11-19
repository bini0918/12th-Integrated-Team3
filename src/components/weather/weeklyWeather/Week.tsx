import WeatherCard from "./dayCard";
import { DayClouds, DaySun } from "../../../assets";
import type { Location } from "../../../types/location";

interface WeekProps {
  location: Location;
}

// location 기준으로 주간 데이터 생성
const getWeeklyWeather = (location: Location) => {
  // 앞으로 API 연동 시 여기서 location.id로 분기 가능
  return [
    { day: "오늘", date: "4.26", humidityAm: 10, humidityPm: 10, low: 8,  high: 19, iconAm: DaySun, iconPm: DayClouds },
    { day: "일",   date: "4.27", humidityAm: 0,  humidityPm: 0,  low: 10, high: 20, iconAm: DaySun, iconPm: DayClouds },
    { day: "월",   date: "4.28", humidityAm: 0,  humidityPm: 0,  low: 9,  high: 20, iconAm: DaySun, iconPm: DayClouds },
    { day: "화",   date: "4.29", humidityAm: 0,  humidityPm: 40, low: 8,  high: 19, iconAm: DaySun, iconPm: DayClouds },
    { day: "수",   date: "4.30", humidityAm: 10, humidityPm: 10, low: 12, high: 22, iconAm: DaySun, iconPm: DayClouds },
  ];
};

const Week = ({ location }: WeekProps) => {
  const weatherData = getWeeklyWeather(location);

  return (
    <div className="w-5xl border-2 border-[#F2F2F2] rounded-2xl bg-[#FFFFFF] p-6 mb-8">
      <h2 className="text-[20px] font-bold text-black mb-3">
        {location.name} 주간 예보
      </h2>

      <div className="flex items-end justify-between">
        {weatherData.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="flex gap-2">
              <WeatherCard
                icon={item.iconAm}
                humidity={item.humidityAm}
                time="오전"
                temp={item.low}
              />
              <WeatherCard
                icon={item.iconPm}
                humidity={item.humidityPm}
                time="오후"
                temp={item.high}
              />
            </div>

            <div className="flex flex-col items-center gap-0.5">
              <span className="text-sm font-normal text-gray-700">{item.day}</span>
              <span className="text-xs">{item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Week;
