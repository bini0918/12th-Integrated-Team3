import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
}

interface AuthStore {
  user: User | null;
  isLoggedIn: boolean;

  login: (user: User) => void;
  logout: () => void;

  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  resetForm: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      user: null,
      isLoggedIn: false,

      login: user => set({ user, isLoggedIn: true }),

      logout: () =>
        set({
          user: null,
          isLoggedIn: false,
        }),

      email: '',
      password: '',
      setEmail: email => set({ email }),
      setPassword: password => set({ password }),
      resetForm: () => set({ email: '', password: '' }),
    }),
    { name: 'auth-storage' },
  ),
);
