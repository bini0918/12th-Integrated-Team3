import { Suspense, memo } from 'react';
import { AnimatePresence } from 'framer-motion';

import Sidebar from '../components/Sidebar';
import WeatherDisplay from '../components/weather/WeatherDetail';
import HourlyForecast from '../components/weather/HourlyForecast';
import Week from '../components/weather/weeklyWeather/Week';
import SearchModal from '../components/modal/SearchModal';
import DeleteModal from '../components/modal/DeleteModal';

import { DayClouds } from '../assets';
import { useWeatherViewModel } from '../hooks/weatherHook/useWeatherViewModel';
import { useHomeLogic } from '../hooks/useHome';
import type { Location } from '../types/location';

const WeatherContent = memo(({ location }: { location: Location }) => {
  const { weatherDisplayProps, hourlyItems, weeklyItems } = useWeatherViewModel(location.id);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-5xl px-6 py-8 animate-fade-in">
      <WeatherDisplay location={location} {...weatherDisplayProps} />
      <HourlyForecast location={location} hours={hourlyItems} />
      <Week location={location} days={weeklyItems} />
    </div>
  );
});

const EmptyState = () => (
  <div className="text-center animate-fade-in">
    <img className="mb-5 h-80 w-80 mx-auto" src={DayClouds} alt="기본 배경" />
    <p className="text-4xl font-bold text-black">아직 선택된 위치가 없습니다!</p>
  </div>
);

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full w-full">
    <div className="text-xl font-medium text-gray-500">날씨 정보를 불러오는 중...</div>
  </div>
);

const Home = () => {
  const {
    locations,
    selectedLocation,
    targetLocationName,
    isSearchOpen,
    isDeleteOpen,
    searchHook,
    handlers,
  } = useHomeLogic();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        locations={locations}
        selectedLocationId={selectedLocation?.id ?? null}
        onSelectLocation={handlers.selectLocation}
        onAddLocation={handlers.openSearch}
        onDeleteLocation={handlers.openDelete}
        onTogglePin={handlers.togglePin}
        onLogout={handlers.logout}
      />

      <main className="flex flex-1 items-center justify-center p-4">
        {selectedLocation ? (
          <Suspense fallback={<LoadingFallback />}>
            <WeatherContent location={selectedLocation} />
          </Suspense>
        ) : (
          <EmptyState />
        )}
      </main>

      <AnimatePresence>
        {isSearchOpen && (
          <SearchModal
            open={isSearchOpen}
            keyword={searchHook.keyword}
            results={searchHook.results}
            pagination={searchHook.pagination}
            onChangeKeyword={searchHook.setKeyword}
            onSearch={searchHook.search}
            onSelect={handlers.addLocation}
            onClose={handlers.closeSearch}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteOpen && (
          <DeleteModal
            open={isDeleteOpen}
            locationName={targetLocationName}
            onCancel={handlers.closeDelete}
            onConfirm={handlers.confirmDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const HomePageWithSuspense = () => (
  <Suspense fallback={<div className="flex h-screen items-center justify-center">로딩 중...</div>}>
    <Home />
  </Suspense>
);

export default HomePageWithSuspense;
