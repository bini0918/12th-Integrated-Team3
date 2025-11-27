import { useEffect, useMemo } from 'react';
import { useLocationsStore } from '../store/useLocationsStore';
import {
  useLocationsQuery,
  useAddLocationMutation,
  useDeleteLocationMutation,
  useTogglePinMutation,
} from './locationHook/useLocationQueries';
import useKakaoSearch from './locationHook/useKakaoSearch';
import { useLogout } from './useLogout';

interface KakaoPlace {
  place_name: string;
  y: string;
  x: string;
  road_address_name: string;
  address_name: string;
}

export const useHomeLogic = () => {
  // 1. 상태 및 쿼리
  const store = useLocationsStore();
  const { data: locations } = useLocationsQuery();
  const { logout } = useLogout();

  // 2. 검색 훅
  const searchHook = useKakaoSearch();

  // 3. Mutations
  const addMutation = useAddLocationMutation();
  const deleteMutation = useDeleteLocationMutation();
  const pinMutation = useTogglePinMutation();

  // 4. 파생 데이터
  const selectedLocation = useMemo(
    () => locations.find(l => l.id === store.selectedLocationId) ?? null,
    [locations, store.selectedLocationId],
  );

  const targetLocationName = useMemo(
    () =>
      store.deleteTargetId ? locations.find(l => l.id === store.deleteTargetId)?.name : undefined,
    [locations, store.deleteTargetId],
  );

  // 5. Effects
  useEffect(() => {
    if (store.isSearchOpen) searchHook.reset();
  }, [store.isSearchOpen, searchHook.reset]);

  // 6. 핸들러 정의
  const handlers = useMemo(
    () => ({
      selectLocation: (id: number) => {
        store.selectLocation(store.selectedLocationId === id ? null : id);
      },
      togglePin: (id: number) => {
        const target = locations.find(l => l.id === id);
        if (target) pinMutation.mutate({ id, pinned: !target.pinned });
      },
      addLocation: (place: KakaoPlace) => {
        addMutation.mutate(
          {
            placeName: place.place_name,
            lat: Number(place.y),
            lng: Number(place.x),
            address: place.road_address_name || place.address_name,
          },
          {
            onSuccess: data => {
              store.selectLocation(data.id);
              store.closeSearch();
            },
          },
        );
      },
      confirmDelete: () => {
        if (store.deleteTargetId !== null) deleteMutation.mutate(store.deleteTargetId);
        store.closeDelete();
      },
      logout,
      openSearch: store.openSearch,
      closeSearch: store.closeSearch,
      openDelete: store.openDelete,
      closeDelete: store.closeDelete,
    }),
    [store, locations, pinMutation, addMutation, deleteMutation, logout],
  );

  return {
    locations,
    selectedLocation,
    targetLocationName,
    isSearchOpen: store.isSearchOpen,
    isDeleteOpen: store.isDeleteOpen,
    searchHook,
    handlers,
  };
};
