import axios from 'axios';
import { useEffect, useState } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { BASE_URL, REFRESH_TOKEN_URL } from './constants/endpoint';
import Sidebar from './components/Sidebar';

function App() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (accessToken) {
        setIsInitializing(false);
        return;
      }

      try {
        const response = await axios.post(
          `${BASE_URL}${REFRESH_TOKEN_URL}`,
          {},
          { withCredentials: true },
        );
        const { accessToken } = response.data;
        setAccessToken(accessToken);
      } catch (error) {
        console.log(error);
      } finally {
        // 성공하든 실패하든 로딩 상태 종료
        setIsInitializing(false);
      }
    };

    initAuth();
  }, []);

  // 초기 인증 확인 중에는 화면을 가려줍니다 (깜빡임 방지)
  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>인증 정보 확인 중...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Outlet />
      <ScrollRestoration />
    </div>
  );
}

export default App;
