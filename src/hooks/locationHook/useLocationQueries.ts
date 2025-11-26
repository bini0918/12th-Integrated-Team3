import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchLocations,
  createLocation,
  deleteLocation,
  toggleLocationPin,
} from '../../api/location';

// 1. 위치 목록 조회 Hook
export function useLocationsQuery() {
  return useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const data = await fetchLocations();
      const locationsData = Array.isArray(data) ? data : data.results || [];
      const list = Array.isArray(locationsData) ? locationsData : [];

      const mapped = list.map((loc: any) => ({
        ...loc,
        id: loc.id ?? loc.locationId,
        name: loc.name ?? loc.placeName,
        pinned: loc.pinned ?? loc.isPinned ?? false,
      }));

      mapped.sort((a: any, b: any) => Number(b.pinned) - Number(a.pinned));

      return mapped;
    },
  });
}

// 2. 위치 등록 Mutation Hook
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
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
    onError: err => {
      console.error('장소 추가 실패:', err);
      alert('장소 등록 중 오류가 발생했습니다.');
    },
  });
}

// 3. 위치 삭제 Mutation Hook
export function useDeleteLocationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteLocation(id),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
    onError: err => {
      console.error('장소 삭제 실패:', err);
      alert('장소 삭제 중 오류가 발생했습니다.');
    },
  });
}

// 4. 핀 토글 Mutation Hook
export function useTogglePinMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, pinned }: { id: number; pinned: boolean }) => {
      return toggleLocationPin(id, pinned);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
    onError: err => {
      console.error('핀 토글 실패:', err);
      alert('핀 고정에 실패했습니다.');
    },
  });
}
