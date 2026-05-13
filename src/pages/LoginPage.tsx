import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { postOAuthRedeem } from '../api/auth';
import { useAuthStore } from '../stores/authStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const isProcessing = useRef(false);

  const ott = searchParams.get('ott');

  useEffect(() => {
    if (!ott || isProcessing.current) return;
    isProcessing.current = true;

    // URL에서 OTT 즉시 제거 — history/Referer 노출 차단
    window.history.replaceState(null, '', window.location.pathname);

    postOAuthRedeem(ott)
      .then(({ accessToken }) => {
        setAccessToken(accessToken);

        const returnUrl = sessionStorage.getItem('returnUrl');
        const destination = returnUrl || '/';

        sessionStorage.removeItem('returnUrl');
        navigate(destination, { replace: true });
      })
      .catch((e) => {
        console.error('OAuth OTT redeem failed:', e);
      });
  }, [ott, setAccessToken, navigate]);

  return <div>Loading...</div>;
};

export default LoginPage;
