import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { logout as logoutApi } from '../api/auth';
import { useAuthStore } from '../store/useAuthStore';

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logoutFromStore = useAuthStore(state => state.logout);
  const resetForm = useAuthStore(state => state.resetForm);

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('로그아웃 요청 실패:', error);
    } finally {
      queryClient.clear();

      logoutFromStore();
      resetForm();
      navigate('/');
    }
  };

  return { logout };
}
