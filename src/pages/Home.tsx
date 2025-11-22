import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import WeatherDisplay from '../components/weather/WeatherDetail';
import HourlyForecast from '../components/weather/HourlyForecast';
import Week from '../components/weather/weeklyWeather/Week';
import SearchModal from '../components/modal/SearchModal';
import DeleteModal from '../components/modal/DeleteModal';
import { DayClouds } from '../assets';

import useKakaoSearch from '../hooks/useKakaoSearch';
import { useLocationsStore } from '../store/useLocationsStore';

const Home = () => {
  const {
    locations,
    selectedLocationId,
    isSearchOpen,
    isDeleteOpen,
    deleteTargetId,

    addLocation,
    removeLocation,
    togglePin,
    selectLocation,
    openSearch,
    closeSearch,
    openDelete,
    closeDelete,
  } = useLocationsStore();

  const selectedLocation = locations.find(l => l.id === selectedLocationId) ?? null;

  // Kakao 검색 hook
  const { keyword, setKeyword, results, pagination, search, reset } = useKakaoSearch();
  // 검색 모달 열릴 때 초기화
  useEffect(() => {
    if (isSearchOpen) reset();
  }, [isSearchOpen]);

  /** 모달에서 장소 선택 */
  const handleSelectPlace = (place: any) => {
    const loc = {
      id: Date.now(),
      name: place.place_name,
      lat: Number(place.y),
      lng: Number(place.x),
      address: place.road_address_name || place.address_name,
      pinned: false,
    };

    addLocation(loc);
    closeSearch();
  };

  /** 삭제 확정 */
  const confirmDelete = () => {
    if (deleteTargetId !== null) {
      removeLocation(deleteTargetId);
    }
    closeDelete();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        locations={locations}
        selectedLocationId={selectedLocationId}
        onSelectLocation={id => selectLocation(selectedLocationId === id ? null : id)}
        onAddLocation={openSearch}
        onDeleteLocation={openDelete}
        onTogglePin={togglePin}
      />

      <main className="flex flex-1 items-center justify-center">
        {!selectedLocation && (
          <div className="text-center">
            <img className="mb-5 h-80 w-80" src={DayClouds} />
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
        onClose={closeSearch}
      />

      <DeleteModal
        open={isDeleteOpen}
        locationName={
          deleteTargetId ? locations.find(l => l.id === deleteTargetId)?.name : undefined
        }
        onCancel={closeDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Home;
