import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  isAuthLoading: boolean;
  setAccessToken: (token: string) => void;
  logout: () => void;
  setAuthLoading: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isAuthLoading: true,

  setAccessToken: (token) => set({ accessToken: token }),
  logout: () => set({ accessToken: null }),
  setAuthLoading: (value) => set({ isAuthLoading: value }),
}));
