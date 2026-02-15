import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  isLoggedIn: boolean;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isLoggedIn: false, // 로그인 상태 확인용
  setAccessToken: (token) => set({ accessToken: token, isLoggedIn: true }),
  logout: () => set({ accessToken: null, isLoggedIn: false }),
}));
