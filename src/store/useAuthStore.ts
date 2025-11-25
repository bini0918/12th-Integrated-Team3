// src/store/useAuthStore.ts
import { create } from 'zustand';

interface AuthStore {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthStore>(set => ({
  email: '',
  password: '',
  setEmail: email => set({ email }),
  setPassword: password => set({ password }),
  reset: () => set({ email: '', password: '' }),
}));
