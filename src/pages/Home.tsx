import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import WeatherDisplay from '../components/weather/WeatherDetail';
import HourlyForecast from '../components/weather/HourlyForecast';
import Week from '../components/weather/weeklyWeather/Week';
import SearchModal from '../components/modal/SearchModal';
import DeleteModal from '../components/modal/DeleteModal';
import { DayClouds } from '../assets';

import useKakaoSearch from '../hooks/locationHook/useKakaoSearch';
import { useLocationsStore } from '../store/useLocationsStore';
import { useWeatherViewModel } from '../hooks/weatherHook/useWeatherViewModel';
import {
  useLocationsQuery,
  useAddLocationMutation,
  useDeleteLocationMutation,
  useTogglePinMutation,
} from '../hooks/locationHook/useLocationQueries';
import { useLogout } from '../hooks/useLogout';

const Home = () => {
  // 1. UI 상태 (Zustand)
  const {
    selectedLocationId,
    isSearchOpen,
    isDeleteOpen,
    deleteTargetId,
    selectLocation,
    openSearch,
    closeSearch,
    openDelete,
    closeDelete,
  } = useLocationsStore();

  // 2. 서버 데이터 (React Query)
  const { data: serverLocations } = useLocationsQuery();
  const locations = serverLocations || [];
  const selectedLocation = locations.find(l => l.id === selectedLocationId) ?? null;

  // 3. 날씨 로직 (Custom Hook)
  const {
    weatherDisplayProps,
    hourlyItems,
    weeklyItems,
    isLoading: isWeatherLoading,
    isError: isWeatherError,
  } = useWeatherViewModel(selectedLocation?.id);

  // 4. 액션 (Mutations & Handlers)
  const addLocationMutation = useAddLocationMutation();
  const deleteLocationMutation = useDeleteLocationMutation();
  const togglePinMutation = useTogglePinMutation();
  const { logout } = useLogout();

  // Kakao 검색
  const { keyword, setKeyword, results, pagination, search, reset } = useKakaoSearch();

  // 검색 모달 열릴 때 초기화
  useEffect(() => {
    if (isSearchOpen) reset();
  }, [isSearchOpen, reset]);

  const handleSelectPlace = (place: any) => {
    addLocationMutation.mutate(
      {
        placeName: place.place_name,
        lat: Number(place.y),
        lng: Number(place.x),
        address: place.road_address_name || place.address_name,
      },
      { onSuccess: closeSearch },
    );
  };

  const confirmDelete = () => {
    if (deleteTargetId !== null) deleteLocationMutation.mutate(deleteTargetId);
    closeDelete();
  };

  const handleTogglePin = (id: number) => {
    const target = locations.find(l => l.id === id);
    if (target) togglePinMutation.mutate({ id, pinned: !target.pinned });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        locations={locations}
        selectedLocationId={selectedLocationId}
        onSelectLocation={id => selectLocation(selectedLocationId === id ? null : id)}
        onAddLocation={openSearch}
        onDeleteLocation={openDelete}
        onTogglePin={handleTogglePin}
        onLogout={logout}
      />

      <main className="flex flex-1 items-center justify-center p-4">
        {!selectedLocation && (
          <div className="text-center">
            <img className="mb-5 h-80 w-80 mx-auto" src={DayClouds} alt="기본 배경" />
            <p className="text-4xl font-bold text-black">아직 선택된 위치가 없습니다!</p>
          </div>
        )}

        {selectedLocation && (
          <div className="flex flex-col items-center gap-8 w-full max-w-5xl px-6 py-8">
            {isWeatherLoading && <p className="text-gray-600">날씨 정보를 불러오는 중...</p>}
            {isWeatherError && <p className="text-red-500">날씨 정보를 불러오는데 실패했습니다.</p>}

            {weatherDisplayProps && (
              <WeatherDisplay location={selectedLocation} {...weatherDisplayProps} />
            )}

            <HourlyForecast location={selectedLocation} hours={hourlyItems} />
            <Week location={selectedLocation} days={weeklyItems} />
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
