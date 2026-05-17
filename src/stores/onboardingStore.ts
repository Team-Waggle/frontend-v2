import { create } from 'zustand';

const PENDING_TERMS_KEY = 'pendingTermsAfterProfileCreation';

interface OnboardingState {
  isPendingTermsAfterProfileCreation: boolean;
  setPendingTermsAfterProfileCreation: (value: boolean) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  isPendingTermsAfterProfileCreation:
    sessionStorage.getItem(PENDING_TERMS_KEY) === 'true',
  setPendingTermsAfterProfileCreation: (value) => {
    if (value) {
      sessionStorage.setItem(PENDING_TERMS_KEY, 'true');
    } else {
      sessionStorage.removeItem(PENDING_TERMS_KEY);
    }

    set({ isPendingTermsAfterProfileCreation: value });
  },
}));
