import { useEffect, useState } from 'react';
import { Outlet, ScrollRestoration, useMatch } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { usePostRefresh } from './hooks/useAuth';
import { useStompClient } from './hooks/useStompClient';
import Sidebar from './components/Sidebar';
import FloatingMessageButton from './components/Message/FloatingMessageButton';

function App() {
  const { mutateAsync: silentRefresh } = usePostRefresh();
  const messageMatch = useMatch('/message/:partnerId');
  useStompClient(messageMatch?.params?.partnerId);

  const { accessToken, isProfileComplete } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (accessToken) {
        setIsInitializing(false);
        return;
      }

      if (!isProfileComplete) {
        setIsInitializing(false);
        return;
      }

      try {
        await silentRefresh();
      } catch (error) {
        console.error(error);
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, [accessToken, isProfileComplete, silentRefresh]);

  // 초기 인증 확인 중에는 화면을 가려줍니다 (깜빡임 방지)
  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>인증 정보 확인 중...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen min-h-screen w-full min-w-[144rem]">
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
