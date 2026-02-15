import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuthStore } from '../stores/authStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const accessToken = searchParams.get('accessToken');

  useEffect(() => {
    if (!accessToken) return;

    setAccessToken(accessToken);
    navigate('/', { replace: true });
  }, [accessToken, setAccessToken, navigate]);
  return <div>Loading...</div>;
};

export default LoginPage;
