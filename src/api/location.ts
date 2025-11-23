// src/api/location.ts

const BASE = '/api/v1/location';

/** 위치 등록 */
export async function createLocation(placeName: string, lat: number, lng: number) {
  const res = await fetch(`${BASE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      placeName,
      latitude: lat,
      longitude: lng,
    }),
  });

  if (!res.ok) throw new Error('장소 생성 실패');

  return res.json(); // { locationId: number }
}

/** 위치 목록 조회 */
export async function fetchLocations() {
  const res = await fetch(`${BASE}`, {
    method: 'GET',
  });

  if (!res.ok) throw new Error('위치 목록 조회 실패');
  return res.json();
}

/** 위치 삭제 */
export async function deleteLocation(id: number) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error('위치 삭제 실패');
  return res.json();
}

/** 핀 토글 */
export async function toggleLocationPin(id: number) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
  });

  if (!res.ok) throw new Error('핀 토글 실패');
  return res.json();
}
