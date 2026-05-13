import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import { REFRESH_TOKEN_URL } from '../constants/endpoint';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  paramsSerializer: {
    indexes: null,
},
});

// 동시 401 요청이 각자 /auth/refresh를 호출하면 BE rotation이
// 첫 응답 외 모두 reuse로 판정하므로, 진행 중인 refresh가 있으면 공유한다.
let refreshPromise: Promise<string> | null = null;

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes(REFRESH_TOKEN_URL)
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post(
              `${import.meta.env.VITE_BASE_URL}${REFRESH_TOKEN_URL}`,
              {},
              { withCredentials: true },
            )
            .then((res) => {
              const newAccessToken = res.data.accessToken as string;
              useAuthStore.getState().setAccessToken(newAccessToken);
              return newAccessToken;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newAccessToken = await refreshPromise;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
