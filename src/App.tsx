import { useEffect } from 'react';
import { Outlet, ScrollRestoration, useMatch } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { usePostRefresh } from './hooks/useAuth';
import { useStompClient } from './hooks/useStompClient';
import { usePageTracking } from './hooks/usePageTracking';
import Sidebar from './components/Sidebar';
import FloatingMessageButton from './components/Message/FloatingMessageButton';

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
    <div className="flex min-h-screen w-full min-w-[144rem]">
      <Sidebar />
      <main className="mx-auto flex h-full w-full min-w-0 flex-col">
        <Outlet />
      </main>
      <FloatingMessageButton />
      <ScrollRestoration />
    </div>
  );
}

export default App;
