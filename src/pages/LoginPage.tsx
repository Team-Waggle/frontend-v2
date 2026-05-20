import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { postOAuthRedeem } from '../api/auth';
import { useAuthStore } from '../stores/authStore';
import { trackEvent } from '../lib/ga';

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const isProcessing = useRef(false);

  const ott = searchParams.get('ott');
  const errorCode = searchParams.get('errorCode');

  useEffect(() => {
    if (isProcessing.current) return;

    if (errorCode) {
      isProcessing.current = true;
      console.error('OAuth error:', errorCode);
      navigate('/', { replace: true });
      return;
    }

    if (!ott) return;
    isProcessing.current = true;

    // URL에서 OTT 즉시 제거 — history/Referer 노출 차단
    window.history.replaceState(null, '', window.location.pathname);

    postOAuthRedeem(ott)
      .then(({ accessToken }) => {
        const provider = sessionStorage.getItem('loginProvider') as 'google' | 'kakao' | null;
        if (provider === 'google' || provider === 'kakao') {
          trackEvent({ action: 'login', label: provider });
        }
        sessionStorage.removeItem('loginProvider');

        setAccessToken(accessToken);

        const returnUrl = sessionStorage.getItem('returnUrl');
        const destination = returnUrl || '/';

        sessionStorage.removeItem('returnUrl');
        navigate(destination, { replace: true });
      })
      .catch((e) => {
        console.error('OAuth OTT redeem failed:', e);
        navigate('/', { replace: true });
      })
      .finally(() => {
        isProcessing.current = false;
      });
  }, [ott, errorCode, setAccessToken, navigate]);

  return <div>Loading...</div>;
};

export default LoginPage;
