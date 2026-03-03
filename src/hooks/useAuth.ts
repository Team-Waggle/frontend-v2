import { useMutation } from '@tanstack/react-query';
import { postLogout, postRefresh } from '../api/auth';
import { useAuthStore } from '../stores/authStore';

// 로그아웃
export const usePostLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  return useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      logout();
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

// 액세스 토큰 재발급
export const usePostRefresh = () => {
  return useMutation({
    mutationFn: postRefresh,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
