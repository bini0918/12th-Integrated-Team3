import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { logout as logoutApi } from '../api/auth';
import { useAuthStore } from '../store/useAuthStore';
import { useLocationsStore } from '../store/useLocationsStore';

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const resetAuth = useAuthStore(state => state.reset);
  const setLocations = useLocationsStore(state => state.setLocations);

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('로그아웃 요청 실패:', error);
    } finally {
      queryClient.clear();

      resetAuth();
      setLocations([]); // 위치 목록 상태 비우기

      navigate('/');
    }
  };

  return { logout };
}
