import { useEffect, useState } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { usePostRefresh } from './hooks/useAuth';
import Sidebar from './components/Sidebar';
import FloatingMessageButton from './components/Message/FloatingMessageButton';

function App() {
  const { mutateAsync: silentRefresh } = usePostRefresh();

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
    <div className="flex min-h-screen w-full min-w-[144rem]">
      <Sidebar />
      <main className="mx-auto w-full min-w-0">
        <Outlet />
      </main>
      <FloatingMessageButton />
      <ScrollRestoration />
    </div>
  );
}

export default App;
