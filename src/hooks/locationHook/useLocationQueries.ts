import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchLocations, createLocation, deleteLocation } from '../../api/location';
import { useLocationsStore } from '../../store/useLocationsStore';

// 1. 위치 목록 조회 Hook
export function useLocationsQuery() {
  return useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const data = await fetchLocations();
      const mapped = data.results.map((loc: any) => ({
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
  const { addLocation } = useLocationsStore();

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
    onSuccess: newLocation => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });

      addLocation({
        id: newLocation.id,
        name: newLocation.placeName,
        lat: newLocation.lat,
        lng: newLocation.lng,
        address: newLocation.address,
        pinned: false,
      });
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
  const { removeLocation } = useLocationsStore();

  return useMutation({
    mutationFn: (id: number) => deleteLocation(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      removeLocation(id);
    },
  });
}
