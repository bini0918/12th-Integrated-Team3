// src/api/location.ts

const BASE = '/api/v1/location';

/** 위치 등록 */
export async function createLocation(placeName: string, lat: number, lng: number) {
  const res = await fetch(`${BASE}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      placeName,
      latitude: lat,
      longitude: lng,
    }),
  });
  if (!res.ok) throw new Error('장소 생성 실패');

  const data = await res.json();

  return data.results || data;
}

/** 위치 목록 조회 */
export async function fetchLocations() {
  const res = await fetch(`${BASE}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) throw new Error('위치 목록 조회 실패');
  return res.json();
}

/** 위치 삭제 */
export async function deleteLocation(id: number) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!res.ok) throw new Error('위치 삭제 실패');
  return res.json();
}

/** 핀 토글 */
export async function toggleLocationPin(id: number, pinned: boolean) {
  const res = await fetch(`${BASE}/${id}/pin`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pinned,
    }),
  });

  if (!res.ok) throw new Error('핀 토글 실패');
  return res.json();
}
