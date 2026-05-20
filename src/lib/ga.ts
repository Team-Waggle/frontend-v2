import ReactGA from 'react-ga4';

export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;

  ReactGA.initialize(measurementId, {
    testMode: import.meta.env.DEV,
  });
};

export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};

type GAEvent =
  | { action: 'click_apply'; label: string; post_id: string }
  | { action: 'click_post'; label: string; post_id: string }
  | { action: 'search'; label: string }
  | { action: 'filter_job'; label: string }
  | { action: 'filter_skill'; label: string }
  | { action: 'create_post' }
  | { action: 'create_team' }
  | { action: 'send_message' }
  | { action: 'login'; label: 'google' | 'kakao' };

export const trackEvent = (event: GAEvent) => {
  ReactGA.event({ category: 'user_interaction', ...event });
};

export const setUserProperties = (userId: number) => {
  ReactGA.set({ user_id: String(userId) });
};

export const clearUserProperties = () => {
  ReactGA.set({ user_id: undefined });
};
