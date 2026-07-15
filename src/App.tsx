import { useEffect } from 'react';
import { Outlet, ScrollRestoration, useMatch } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { usePostRefresh } from './hooks/useAuth';
import { useStompClient } from './hooks/useStompClient';
import { usePageTracking } from './hooks/usePageTracking';
import Sidebar from './components/Sidebar';
import FloatingMessageButton from './components/Message/FloatingMessageButton';
import BottomNavigation from './components/BottomNavigation';
import MobileHeader from './components/MobileHeader';

function App() {
  const { mutateAsync: silentRefresh } = usePostRefresh();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  const messageMatch = useMatch('/message/:partnerId');
  const partnerId = messageMatch?.params?.partnerId;

  usePageTracking();

  useEffect(() => {
    const initAuth = async () => {
      try {
        await silentRefresh();
      } catch {
        useAuthStore.getState().logout();
      } finally {
        useAuthStore.getState().setAuthLoading(false);
      }
    };

    initAuth();
  }, []);

  useStompClient(!isAuthLoading && accessToken ? partnerId : '');

  if (isAuthLoading) {
    return null;
  }

  return (
    <div className="flex min-h-dvh w-full min-w-[144rem] max-sm:min-w-0">
      <div className="max-sm:hidden">
        <Sidebar />
      </div>
      <main className="mx-auto flex h-full w-full min-w-0 flex-col">
        <MobileHeader />
        <Outlet />
      </main>
      <FloatingMessageButton />
      <div className="hidden max-sm:block">
        <BottomNavigation />
      </div>
      <ScrollRestoration />
    </div>
  );
}

export default App;
