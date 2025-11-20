import { useState } from 'react';
import { DayClouds } from '../assets';
import Sidebar from '../components/Sidebar';
import HourlyForecast from '../components/weather/HourlyForecast';
import type { Location } from '../types/location';
import WeatherDisplay from '../components/weather/WeatherDetail';
import Week from '../components/weather/weeklyWeather/Week';

const Home = () => {
  const locations: Location[] = [
    { id: 1, name: '강남역 퇴근길' },
    { id: 2, name: 'RATTHAT' },
    { id: 3, name: '카페 앞' },
    { id: 4, name: '롯데월드' },
  ];

  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);

  const selectedLocation = locations.find(location => location.id === selectedLocationId) ?? null;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        locations={locations}
        selectedLocationId={selectedLocationId}
        onSelectLocation={setSelectedLocationId}
      />
      <main className="flex flex-1 items-center justify-center">
        {/*기본홈화면*/}
        {!selectedLocation && (
          <div className="text-center">
            <img className="mb-5 h-80 w-80" src={DayClouds} alt="no location" />
            <p className="text-4xl font-bold text-black">아직 선택된 위치가 없습니다!</p>
          </div>
        )}

       {selectedLocation && (
          <div className="flex flex-col items-center gap-8">
            <WeatherDisplay location={selectedLocation} />
            <HourlyForecast location={selectedLocation} />
            <Week location={selectedLocation} />
          </div>
)}

      </main>
    </div>
  );
};

export default Home;
