import { fetchJson } from './client';

const USER_BASE = '/api/v1/user';

export interface UserResponse {
  id: number;
  email: string;
}

/*
로그인
POST /api/v1/user/login
*/
export function login(email: string, password: string) {
  return fetchJson<UserResponse>(`${USER_BASE}/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/*
회원가입
POST /api/v1/user/sign-up
*/
export function signup(email: string, password: string) {
  return fetchJson<UserResponse>(`${USER_BASE}/sign-up`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/*
로그아웃
POST /api/v1/user/logout
*/
export function logout() {
  return fetchJson<unknown>(`${USER_BASE}/logout`, {
    method: 'POST',
  });
}
