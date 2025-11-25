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
  removeLocation: (id: number) => Promise<void>;
  togglePin: (id: number) => Promise<void>;
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
  removeLocation: async (id: number) => {
    await deleteLocation(id);
    set(state => {
      const filtered = state.locations.filter(l => l.id !== id);
      const isRemovedSelected = state.selectedLocationId === id;

      return {
        locations: filtered,
        selectedLocationId: isRemovedSelected ? null : state.selectedLocationId,
      };
    });
  },

  /* 핀 토글 */
  togglePin: async (id: number) => {
    // 1. 롤백을 위해 현재 상태 스냅샷 저장
    const previousLocations = get().locations;

    // 2. 낙관적 업데이트 (UI 먼저 변경)
    set(state => {
      const updatedLocations = state.locations.map(l =>
        l.id === id ? { ...l, pinned: !l.pinned } : l,
      );

      // 3. 정렬 로직: 핀 고정된 항목(true)을 리스트 최상단으로 보냄
      updatedLocations.sort((a, b) => Number(b.pinned) - Number(a.pinned));

      return { locations: updatedLocations };
    });

    try {
      // 4. API 요청 전송
      await toggleLocationPin(id);
    } catch (error) {
      console.error('핀 고정 실패:', error);

      // 5. 실패 시 이전 상태로 원상복구 (롤백)
      set({ locations: previousLocations });
    }
  },

  /* 선택 변경 */
  selectLocation: id => set({ selectedLocationId: id }),

  /* 서버에서 불러온 초깃값 위치 설정 */
  setLocations: (locations: Location[]) => set({ locations }),

  /* 검색 모달 제어 */
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  /* 삭제 모달 제어 */
  openDelete: id => set({ isDeleteOpen: true, deleteTargetId: id }),
  closeDelete: () => set({ isDeleteOpen: false, deleteTargetId: null }),
}));
