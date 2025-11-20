import { useEffect, useState } from 'react';
import { DayClouds } from '../assets';
import Sidebar from '../components/Sidebar';
import HourlyForecast from '../components/weather/HourlyForecast';
import WeatherDisplay from '../components/weather/WeatherDetail';
import Week from '../components/weather/weeklyWeather/Week';
import type { Location } from '../types/location';

import SearchModal from '../components/modal/SearchModal';
import useKakaoSearch from '../hooks/useKakaoSearch';
import DeleteModal from '../components/modal/DeleteModal';

const Home = () => {
  const [locations, setLocations] = useState<Location[]>([
    { id: 1, name: '강남역 퇴근길', pinned: false },
    { id: 2, name: 'RATTHAT', pinned: false },
    { id: 3, name: '카페 앞', pinned: false },
    { id: 4, name: '롯데월드', pinned: false },
  ]);

  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const selectedLocation = locations.find(l => l.id === selectedLocationId) ?? null;

  // 검색 모달 상태
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Kakao 검색 Hook
  const { keyword, setKeyword, results, pagination, search, reset } = useKakaoSearch();

  // 검색 모달 열릴 때 초기화
  useEffect(() => {
    if (isSearchOpen) reset();
  }, [isSearchOpen]);

  //삭제 모달 상태
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  //핀 고정 토글
  const handleTogglePin = (id: number) => {
    setLocations(prev => prev.map(loc => (loc.id === id ? { ...loc, pinned: !loc.pinned } : loc)));
  };

  const handleSelectPlace = (place: any) => {
    const newLocation: Location = {
      id: Date.now(),
      name: place.place_name,
      lat: Number(place.y),
      lng: Number(place.x),
      address: place.road_address_name || place.address_name,
      pinned: false,
    };

    setLocations(prev => [...prev, newLocation]);
    setSelectedLocationId(newLocation.id);
    setIsSearchOpen(false);
  };

  // 삭제 버튼 클릭: 모달 열기
  const handleDeleteLocation = (id: number) => {
    setDeleteTargetId(id);
    setIsDeleteOpen(true);
  };

  // 삭제 확정
  const confirmDelete = () => {
    if (deleteTargetId !== null) {
      setLocations(prev => prev.filter(l => l.id !== deleteTargetId));

      // 혹시 삭제된 게 현재 선택된 위치라면 선택 해제
      if (deleteTargetId === selectedLocationId) {
        setSelectedLocationId(null);
      }
    }

    setIsDeleteOpen(false);
    setDeleteTargetId(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        locations={locations}
        selectedLocationId={selectedLocationId}
        // 선택된 항목을 다시 클릭 시, 선택이 되지 않은 상태로 만들기
        onSelectLocation={id => setSelectedLocationId(prev => (prev === id ? null : id))}
        onAddLocation={() => setIsSearchOpen(true)}
        onDeleteLocation={handleDeleteLocation}
        onTogglePin={handleTogglePin}
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
      {/* 삭제 확인 모달 */}
      <DeleteModal
        open={isDeleteOpen}
        locationName={
          deleteTargetId ? locations.find(l => l.id === deleteTargetId)?.name : undefined
        }
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Home;
