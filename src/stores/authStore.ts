import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  isLoggedIn: boolean;
  isProfileComplete: boolean;
  setAccessToken: (token: string) => void;
  setProfileComplete: (status: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      isLoggedIn: false,
      isProfileComplete: false,

      setAccessToken: (token) => set({ accessToken: token, isLoggedIn: true }),
      setProfileComplete: (status) => set({ isProfileComplete: status }),

      logout: () =>
        set({
          accessToken: null,
          isLoggedIn: false,
          isProfileComplete: false,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // isProfileComplete만 로컬 스토리지에 저장하도록 설정
      partialize: (state) => ({ isProfileComplete: state.isProfileComplete }),
    },
  ),
);
