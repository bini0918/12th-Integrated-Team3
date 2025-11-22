import { useState } from 'react';
import { DayClouds } from '../assets';
import Sidebar from '../components/Sidebar';
import HourlyForecast from '../components/weather/HourlyForecast';
import WeatherDisplay from '../components/weather/WeatherDetail';
import Week from '../components/weather/weeklyWeather/Week';
import type { Location } from '../types/location';

import SearchModal from '../components/SearchModal';
import useKakaoSearch from '../hooks/useKakaoSearch';

const Home = () => {
  const [locations, setLocations] = useState<Location[]>([
    { id: 1, name: '강남역 퇴근길' },
    { id: 2, name: 'RATTHAT' },
    { id: 3, name: '카페 앞' },
    { id: 4, name: '롯데월드' },
  ]);

  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const selectedLocation = locations.find(l => l.id === selectedLocationId) ?? null;

  // 검색 모달 상태
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Kakao 검색 Hook
  const { keyword, setKeyword, results, pagination, search } = useKakaoSearch();

  const handleSelectPlace = (place: any) => {
    const newLocation: Location = {
      id: Date.now(),
      name: place.place_name,
      lat: Number(place.y),
      lng: Number(place.x),
      address: place.road_address_name || place.address_name,
    };

    setLocations(prev => [...prev, newLocation]);
    setSelectedLocationId(newLocation.id);
    setIsSearchOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        locations={locations}
        selectedLocationId={selectedLocationId}
        onSelectLocation={setSelectedLocationId}
        onAddLocation={() => setIsSearchOpen(true)}
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

      <SearchModal
        open={isSearchOpen}
        keyword={keyword}
        results={results}
        pagination={pagination}
        onChangeKeyword={setKeyword}
        onSearch={search}
        onSelect={handleSelectPlace}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
};

export default Home;
