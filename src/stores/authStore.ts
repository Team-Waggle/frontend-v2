import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  userId: string | null;
  isLoggedIn: boolean;
  setAccessToken: (token: string) => void;
  setUserId: (id: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  userId: null,
  isLoggedIn: false,
  setAccessToken: (token) => set({ accessToken: token, isLoggedIn: true }),
  setUserId: (id) => set({ userId: id }),
  logout: () => set({ accessToken: null, userId: null, isLoggedIn: false }),
}));
