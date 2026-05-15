import { postRefresh } from '../api/auth';
import { useAuthStore } from '../stores/authStore';

const TOKEN_EXPIRY_SKEW_MS = 1000;

export const isAccessTokenExpired = (accessToken: string) => {
  try {
    const [, payload] = accessToken.split('.');
    if (!payload) return true;

    const normalizedPayload = payload
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(payload.length / 4) * 4, '=');
    const decodedPayload = JSON.parse(atob(normalizedPayload)) as {
      exp?: number;
    };

    if (!decodedPayload.exp) return true;

    return decodedPayload.exp * 1000 <= Date.now() + TOKEN_EXPIRY_SKEW_MS;
  } catch {
    return true;
  }
};

export const ensureFreshAccessToken = async () => {
  const { accessToken, setAccessToken, logout } = useAuthStore.getState();

  if (accessToken && !isAccessTokenExpired(accessToken)) {
    return true;
  }

  try {
    const data = await postRefresh();
    setAccessToken(data.accessToken);
    return true;
  } catch {
    logout();
    return false;
  }
};
