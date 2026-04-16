import { create } from 'zustand';

interface MessageModalState {
  isOpen: boolean;
  partnerId: string | null;
  open: (partnerId?: string) => void;
  close: () => void;
  toggle: () => void;
  setPartnerId: (partnerId: string | null) => void;
}

export const useMessageModalStore = create<MessageModalState>((set) => ({
  isOpen: false,
  partnerId: null,
  open: (partnerId) => set({ isOpen: true, partnerId: partnerId ?? null }),
  close: () => set({ isOpen: false, partnerId: null }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setPartnerId: (partnerId) => set({ partnerId }),
}));
