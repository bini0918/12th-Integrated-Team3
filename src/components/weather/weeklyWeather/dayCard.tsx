interface WeatherCardProps {
  icon: string;
  humidity: number;
  time: string;
  temp: number;
}


const WeatherCard = ({ icon, humidity, time, temp }: WeatherCardProps) => {
      const tempColor = temp > 10 ? "text-[#FF4D4D]" : "text-[#2D7DFF]";

  return (
    
    <div className="w-20 h-[230px] rounded-xl flex flex-col justify-center items-center gap-6 py-4">
      <img src={icon} alt="weather icon" className="w-14" />
      <span className="text-[#A8C8FF] font-bold text-xl">{humidity}%</span>
      <span className="text-black font-semibold text-base">{time}</span>
      <span className={`${tempColor} font-bold text-xl`}>{temp}°</span>
    </div>
  );
};

export default WeatherCard;
