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
import {
  useCurrentWeather,
  useHourlyWeather,
  useWeeklyWeather,
} from '../hooks/weatherHook/useWeatherQueries';
import {
  useLocationsQuery,
  useAddLocationMutation,
  useDeleteLocationMutation,
} from '../hooks/locationHook/useLocationQueries';
import { kelvinToCelsius } from '../hooks/weatherHook/useWeatherFormat';
import { useLogout } from '../hooks/useLogout';

const Home = () => {
  const {
    locations,
    selectedLocationId,
    isSearchOpen,
    isDeleteOpen,
    deleteTargetId,
    selectLocation,
    openSearch,
    closeSearch,
    openDelete,
    closeDelete,
    setLocations,
    togglePin,
  } = useLocationsStore();

  const { data: serverLocations } = useLocationsQuery();
  const addLocationMutation = useAddLocationMutation();
  const deleteLocationMutation = useDeleteLocationMutation();
  const { logout } = useLogout();

  useEffect(() => {
    if (serverLocations) {
      setLocations(serverLocations);
    }
  }, [serverLocations, setLocations]);

  // Kakao 검색 hook
  const { keyword, setKeyword, results, pagination, search, reset } = useKakaoSearch();
  // 검색 모달 열릴 때 초기화
  useEffect(() => {
    if (isSearchOpen) reset();
  }, [isSearchOpen, reset]);

  const handleSelectPlace = (place: any) => {
    const lat = Number(place.y);
    const lng = Number(place.x);
    const placeName = place.place_name;
    const address = place.road_address_name || place.address_name;

    addLocationMutation.mutate(
      { placeName, lat, lng, address },
      {
        onSuccess: () => {
          closeSearch(); // 성공 시 모달 닫기
        },
      },
    );
  };

  /** 삭제 확정 */
  const confirmDelete = () => {
    if (deleteTargetId !== null) {
      deleteLocationMutation.mutate(deleteTargetId);
    }
    closeDelete();
  };

  const selectedLocation = locations.find(l => l.id === selectedLocationId) ?? null;
  const locationId = selectedLocation?.id;

  // 날씨 데이터 Fetch Hook (locationId가 존재할 때만 실행됨)
  //따로 훅으로 분리?
  const {
    data: currentWeatherData,
    isLoading: isCurrentLoading,
    isError: isCurrentError,
  } = useCurrentWeather(locationId);

  const {
    data: hourlyWeatherData,
    isLoading: isHourlyLoading,
    isError: isHourlyError,
  } = useHourlyWeather(locationId);

  const {
    data: weeklyWeatherData,
    isLoading: isWeeklyLoading,
    isError: isWeeklyError,
  } = useWeeklyWeather(locationId);

  const weatherDisplayProps = currentWeatherData
    ? {
        date: new Date().toLocaleDateString('ko-KR', {
          month: 'numeric',
          day: 'numeric',
        }),
        temperature: currentWeatherData.results.temperature,
        weatherStatus: `${currentWeatherData.results.time} / ${currentWeatherData.results.condition}`,
        stats: [
          {
            label: '체감',
            value: currentWeatherData.results.feelsLike.toFixed(1),
            unit: 'º',
          },
          {
            label: '습도',
            value: String(currentWeatherData.results.humidity),
            unit: '%',
          },
          {
            label: currentWeatherData.results.windDirection,
            value: currentWeatherData.results.windSpeed.toFixed(1),
            unit: 'm/s',
          },
        ],
        tags: [
          {
            id: 'pm10',
            label: '미세먼지',
            status: currentWeatherData.results.airQuality.pm10,
          },
          {
            id: 'pm2_5',
            label: '초미세먼지',
            status: currentWeatherData.results.airQuality.pm2_5,
          },
          {
            id: 'uv',
            label: '자외선',
            status: '보통',
          },
          {
            id: 'sunrise',
            label: '일출',
            status: currentWeatherData.results.sunrise,
          },
        ],
      }
    : undefined;

  const hourlyItems =
    hourlyWeatherData?.results.map(r => ({
      hour: r.hour,
      tempC: kelvinToCelsius(r.temperature),
      condition: r.condition,
      icon: r.icon,
    })) ?? [];

  const weeklyItems = weeklyWeatherData?.results ?? [];
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        locations={locations}
        selectedLocationId={selectedLocationId}
        onSelectLocation={id => selectLocation(selectedLocationId === id ? null : id)}
        onAddLocation={openSearch}
        onDeleteLocation={openDelete}
        onTogglePin={togglePin}
        onLogout={logout} // [추가]
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
            {/* 현재 날씨 */}
            {isCurrentLoading && <p className="text-gray-600">현재 날씨 불러오는 중...</p>}
            {isCurrentError && (
              <p className="text-red-500">현재 날씨를 불러오는 데 실패했습니다.</p>
            )}
            {weatherDisplayProps && (
              <WeatherDisplay location={selectedLocation} {...weatherDisplayProps} />
            )}

            {/* 시간별 */}
            {isHourlyLoading && <p className="text-gray-600">시간별 날씨 불러오는 중...</p>}
            {isHourlyError && (
              <p className="text-red-500">시간별 날씨를 불러오는 데 실패했습니다.</p>
            )}
            <HourlyForecast location={selectedLocation} hours={hourlyItems} />

            {/* 주간 */}
            {isWeeklyLoading && <p className="text-gray-600">주간 날씨 불러오는 중...</p>}
            {isWeeklyError && <p className="text-red-500">주간 날씨를 불러오는 데 실패했습니다.</p>}
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
