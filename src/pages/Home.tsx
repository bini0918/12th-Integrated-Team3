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
import { useCurrentWeather, useHourlyWeather, useWeeklyWeather } from '../hooks/useWeatherQueries';

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
  }, [isSearchOpen, reset]);

  /* 카카오에서 장소 선택하면 전역 스토어에 추가 */
  const handleSelectPlace = (place: any) => {
    const loc = {
      // API 구현이 안되어있는줄 알았는데 되어있더라구요....
      // 장소 등록 바로 구현 해볼게요!
      id: Date.now(), // 임시 ID
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

  const locationId = selectedLocation?.id;

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

  // 현재 날씨 → WeatherDisplay로 넘길 props 변환

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
            status: '보통', // 추후 백엔드 지원되면 변경, 자외선 데이터가 JSON엔 없었습니다.
          },
          {
            id: 'sunrise',
            label: '일출',
            status: currentWeatherData.results.sunrise,
          },
        ],
      }
    : undefined;

  // 시간대 응답 → HourlyForecast로 전달할 데이터

  const hourlyItems =
    hourlyWeatherData?.results.map(r => ({
      hour: r.hour,
      tempC: r.temperature,
      condition: r.condition,
      icon: r.icon,
    })) ?? [];

  // 주간 예보 → Week 컴포넌트로 그대로 전달

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
      />

      <main className="flex flex-1 items-center justify-center">
        {!selectedLocation && (
          <div className="text-center">
            <img className="mb-5 h-80 w-80" src={DayClouds} />
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
