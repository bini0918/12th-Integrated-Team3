import { fetchJson } from './client';
const BASE = '/api/v1/location';

/** 위치 등록 */
export async function createLocation(placeName: string, lat: number, lng: number) {
  return fetchJson(`${BASE}`, {
    method: 'POST',
    body: JSON.stringify({
      placeName,
      latitude: lat,
      longitude: lng,
    }),
  });
}

/** 위치 목록 조회 */
export async function fetchLocations() {
  return fetchJson(`${BASE}`, {
    method: 'GET',
  });
}

/** 위치 삭제 */
export async function deleteLocation(id: number) {
  return fetchJson(`${BASE}/${id}`, {
    method: 'DELETE',
  });
}

/** 핀 토글 */
export async function toggleLocationPin(id: number, pinned: boolean) {
  return fetchJson(`${BASE}/${id}/pin`, {
    method: 'PATCH',
    body: JSON.stringify({
      pinned,
    }),
  });
}
