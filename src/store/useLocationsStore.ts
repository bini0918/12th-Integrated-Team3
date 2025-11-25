// src/store/useLocationsStore.ts
import { create } from 'zustand';
import type { Location } from '../types/location';
import { deleteLocation, toggleLocationPin } from '../api/location';

interface LocationsStore {
  locations: Location[];
  selectedLocationId: number | null;

  isSearchOpen: boolean;
  isDeleteOpen: boolean;
  deleteTargetId: number | null;

  addLocation: (loc: Location) => void;
  removeLocation: (id: number) => void;
  togglePin: (id: number) => void;
  selectLocation: (id: number | null) => void;
  setLocations: (locations: Location[]) => void;

  openSearch: () => void;
  closeSearch: () => void;

  openDelete: (id: number) => void;
  closeDelete: () => void;
}

export const useLocationsStore = create<LocationsStore>((set, get) => ({
  /* 서버 데이터로 채워질 실제 위치 목록 */
  locations: [],

  selectedLocationId: null,

  isSearchOpen: false,
  isDeleteOpen: false,
  deleteTargetId: null,

  /* 위치 추가 */
  addLocation: loc =>
    set(state => ({
      locations: [...state.locations, loc],
      selectedLocationId: loc.id, // 추가 후 자동 선택
    })),

  /* 위치 삭제 */
  removeLocation: (id: number) => {
    set(state => {
      const filtered = state.locations.filter(l => l.id !== id);
      const isRemovedSelected = state.selectedLocationId === id;

      return {
        locations: filtered,
        selectedLocationId: isRemovedSelected ? null : state.selectedLocationId,
      };
    });
  },

  togglePin: async (id: number) => {
    const previousLocations = get().locations;

    const targetLocation = previousLocations.find(l => l.id === id);
    if (!targetLocation) return; // 예외 처리

    const nextPinnedStatus = !(targetLocation.pinned ?? false);

    set(state => {
      const updatedLocations = state.locations.map(l =>
        l.id === id ? { ...l, pinned: nextPinnedStatus } : l,
      );
      updatedLocations.sort((a, b) => Number(b.pinned ?? false) - Number(a.pinned ?? false));

      return { locations: updatedLocations };
    });

    try {
      await toggleLocationPin(id, nextPinnedStatus);
    } catch (error) {
      console.error('핀 고정 실패:', error);

      set({ locations: previousLocations });
    }
  },
  /* 선택 변경 */
  selectLocation: id => set({ selectedLocationId: id }),

  setLocations: (locations: Location[]) => {
    // 핀 고정(true)된 항목이 위로 오도록 정렬
    const sortedLocations = [...locations].sort((a, b) => {
      const pinnedA = Number(a.pinned ?? false);
      const pinnedB = Number(b.pinned ?? false);
      return pinnedB - pinnedA;
    });

    set({ locations: sortedLocations });
  },
  /* 검색 모달 제어 */
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  /* 삭제 모달 제어 */
  openDelete: id => set({ isDeleteOpen: true, deleteTargetId: id }),
  closeDelete: () => set({ isDeleteOpen: false, deleteTargetId: null }),
}));
