import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuthStore } from '../stores/authStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const isProcessing = useRef(false);

  const accessToken = searchParams.get('accessToken');

  useEffect(() => {
    if (!accessToken || isProcessing.current) return;
    isProcessing.current = true;
    setAccessToken(accessToken);

    const returnUrl = sessionStorage.getItem('returnUrl');
    const destination = returnUrl || '/';

    sessionStorage.removeItem('returnUrl');
    navigate(destination, { replace: true });
  }, [accessToken, setAccessToken, navigate]);

  return <div>Loading...</div>;
};

export default LoginPage;
