// src/store/useLocationsStore.ts
import { create } from 'zustand';
import type { Location } from '../types/location';

interface LocationsStore {
  locations: Location[];
  selectedLocationId: number | null;

  isSearchOpen: boolean;
  isDeleteOpen: boolean;
  deleteTargetId: number | null;

  // 액션
  addLocation: (loc: Location) => void;
  removeLocation: (id: number) => void;
  togglePin: (id: number) => void;
  selectLocation: (id: number | null) => void;

  openSearch: () => void;
  closeSearch: () => void;

  openDelete: (id: number) => void;
  closeDelete: () => void;
}

export const useLocationsStore = create<LocationsStore>((set, get) => ({
  locations: [
    { id: 1, name: '강남역 퇴근길', pinned: false },
    { id: 2, name: 'RATTHAT', pinned: false },
    { id: 3, name: '카페 앞', pinned: false },
    { id: 4, name: '롯데월드', pinned: false },
  ],

  selectedLocationId: null,

  isSearchOpen: false,
  isDeleteOpen: false,
  deleteTargetId: null,

  /** 위치 추가 */
  addLocation: loc =>
    set(state => ({
      locations: [...state.locations, loc],
      selectedLocationId: loc.id,
    })),

  /** 위치 삭제 */
  removeLocation: id =>
    set(state => ({
      locations: state.locations.filter(l => l.id !== id),
      selectedLocationId: state.selectedLocationId === id ? null : state.selectedLocationId,
    })),

  /** 핀 고정 */
  togglePin: id =>
    set(state => ({
      locations: state.locations.map(l => (l.id === id ? { ...l, pinned: !l.pinned } : l)),
    })),

  /** 선택 */
  selectLocation: id => set({ selectedLocationId: id }),

  /** 검색 모달 */
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  /** 삭제 모달 */
  openDelete: id => set({ isDeleteOpen: true, deleteTargetId: id }),
  closeDelete: () => set({ isDeleteOpen: false, deleteTargetId: null }),
}));
