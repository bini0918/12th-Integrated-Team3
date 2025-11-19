import React, { memo } from "react";
import { NightClouds } from "../../assets";

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
  locationName?: string;
  date?: string;
  temperature?: number;
  weatherStatus?: string;
  stats?: WeatherStat[];
  tags?: WeatherTagData[];
}

const DEFAULT_WEATHER: Required<WeatherDisplayProps> = {
  locationName: "롯데월드",
  date: "4월 26일",
  temperature: 12.2,
  weatherStatus: "야간 / 흐림",
  stats: [
    { label: "체감", value: "9.0", unit: "º" },
    { label: "습도", value: "48", unit: "%" },
    { label: "남동풍", value: "0.4", unit: "m/s" },
  ],
  tags: [
    { id: "dust", label: "미세먼지", status: "좋음" },
    { id: "ultra", label: "초미세먼지", status: "보통" },
    { id: "uv", label: "자외선", status: "위험" },
    { id: "sun", label: "일출", status: "05:44" },
  ],
};

{/* 기상요소(체감, 습도, 남동풍 등등...) 보여주는 컴포넌트*/}
const StatItem = memo(({ label, value, unit }: WeatherStat) => (
  <div className="flex items-center gap-1 text-gray-600 font-medium text-sm md:text-base">
    <span className="text-gray-500">{label}</span>
    <span className="text-gray-800 font-bold">
      {value}
      {unit}
    </span>
  </div>
));

{/*좋음, 보통, 나쁨에 따라 색을 바꾸는 컴포넌트*/}
const StatusTag = memo(({ label, status }: WeatherTagData) => {
  const bgColor =
    status === "좋음"
      ? "bg-[#CCE8FF]"
      : status === "보통"
      ? "bg-[#CEFFCC]"
      : status === "나쁨" || status === "위험"
      ? "bg-[#FFCCCC]"
      : status.includes(":")
      ? "bg-[#F6FFCC]"
      : "bg-gray-200";

  const textColor =
    status === "좋음"
      ? "text-[#2D7DFF]"
      : status === "보통"
      ? "text-[#32FF35]"
      : status === "나쁨" || status === "위험"
      ? "text-[#FF3232]"
      : status.includes(":")
      ? "text-[#FFC532]"
      : "text-black";

  return (
    <div
      className={`flex flex-col w-32 px-4 py-2 rounded-xl text-sm text-center transition-transform hover:scale-[1.05] ${bgColor}`}
    >
      <span className="opacity-80 text-black text-sm font-medium mb-2">{label}</span>
      <span className={`${textColor} text-sm font-semibold`}>{status}</span>
    </div>
  );
});

{/*아이콘과 온도를 보여주는 컴포넌트*/}
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
        <img
          src={icon}
          alt="날씨 아이콘"
          className="w-24 h-24 md:w-32 md:h-32 object-contain"
        />
        <span className="text-[70px] md:text-[110px] font-extrabold text-black leading-none tracking-tight drop-shadow-sm">
          {temperature}°
        </span>
      </div>
      <div className="text-lg md:text-xl font-bold">{weatherStatus}</div>
    </div>
  )
);


export default function WeatherDisplay(props: WeatherDisplayProps) {
  const { locationName, date, temperature, weatherStatus, stats, tags } = {
    ...DEFAULT_WEATHER,
    ...props,
  };

  return (
    <div className="flex flex-col justify-center items-center w-5xl border-2 border-[#F2F2F2] rounded-2xl bg-[#FFFFFF] p-6">
        <div className="w-full text-[20px] font-bold text-black mb-3 p-1.5">
          {date} {locationName} 날씨 현황
        </div>

        <WeatherHeader
          icon={NightClouds}
          temperature={temperature}
          weatherStatus={weatherStatus}
        />

        <div className="flex flex-wrap justify-center gap-4 md:gap-8 p-4 mb-5">
          {stats.map((stat, i) => (
            <StatItem key={i} {...stat} />
          ))}
        </div>

        <div className="flex justify-center gap-3 mb-5">
          {tags.map((tag) => (
            <StatusTag key={tag.id} {...tag} />
          ))}
        </div>
      </div>
    
  );
}
