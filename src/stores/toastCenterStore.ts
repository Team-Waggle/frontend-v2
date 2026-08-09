import { create } from 'zustand';

interface ToastCenterState {
  centerX: number | null;
  setCenterX: (centerX: number | null) => void;
}

export const useToastCenterStore = create<ToastCenterState>((set) => ({
  centerX: null,
  setCenterX: (centerX) => set({ centerX }),
}));
