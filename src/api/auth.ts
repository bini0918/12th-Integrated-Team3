// src/api/auth.ts
const USER_BASE = '/api/v1/user';

export interface UserResponse {
  id: number;
  email: string;
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `요청 실패: ${res.status}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
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
