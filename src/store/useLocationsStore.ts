import { create } from 'zustand';

interface LocationsStore {
  selectedLocationId: number | null;
  isSearchOpen: boolean;
  isDeleteOpen: boolean;
  deleteTargetId: number | null;

  selectLocation: (id: number | null) => void;
  openSearch: () => void;
  closeSearch: () => void;
  openDelete: (id: number) => void;
  closeDelete: () => void;
}

export const useLocationsStore = create<LocationsStore>(set => ({
  selectedLocationId: null,
  isSearchOpen: false,
  isDeleteOpen: false,
  deleteTargetId: null,

  selectLocation: id => set({ selectedLocationId: id }),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  openDelete: id => set({ isDeleteOpen: true, deleteTargetId: id }),
  closeDelete: () => set({ isDeleteOpen: false, deleteTargetId: null }),
}));
