import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchLocations,
  createLocation,
  deleteLocation,
  toggleLocationPin,
} from '../../api/location';
import type { Location } from '../../types/location';

// 1. 위치 목록 조회 Hook
export function useLocationsQuery() {
  return useSuspenseQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const data = await fetchLocations();
      const locationsData = Array.isArray(data) ? data : data.results || [];
      const list = Array.isArray(locationsData) ? locationsData : [];

      const mapped: Location[] = list.map((loc: any) => ({
        id: loc.id ?? loc.locationId,
        name: loc.name ?? loc.placeName,
        lat: loc.lat ?? loc.latitude,
        lng: loc.lng ?? loc.longitude,
        address: loc.address,
        pinned: loc.pinned ?? loc.isPinned ?? false,
      }));
      mapped.sort((a, b) => Number(b.pinned) - Number(a.pinned));

      return mapped;
    },
  });
}

export function useAddLocationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      placeName: string;
      lat: number;
      lng: number;
      address: string;
    }) => {
      const result = await createLocation(params.placeName, params.lat, params.lng);
      const newId = result.locationId ?? result.id;
      if (!newId) throw new Error('서버로부터 유효한 Location ID를 받지 못했습니다.');
      return { ...params, id: newId };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['locations'] }),
    onError: err => {
      console.error('장소 추가 실패:', err);
      alert('장소 등록 중 오류가 발생했습니다.');
    },
  });
}

export function useDeleteLocationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteLocation(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['locations'] }),
    onError: err => {
      console.error('장소 삭제 실패:', err);
      alert('장소 삭제 중 오류가 발생했습니다.');
    },
  });
}

export function useTogglePinMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, pinned }: { id: number; pinned: boolean }) => toggleLocationPin(id, pinned),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['locations'] }),
    onError: err => {
      console.error('핀 토글 실패:', err);
      alert('핀 고정에 실패했습니다.');
    },
  });
}
