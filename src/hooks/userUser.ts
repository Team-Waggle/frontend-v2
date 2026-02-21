import { useNavigate } from 'react-router';
import { useAuthStore } from '../stores/authStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getUserDetail,
  getUserMe,
  getIsUserProfileComplete,
  postUserProfile,
} from '../api/user';

// 사용자 조회
export const useGetUserDetail = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserDetail(userId!),
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });
};

// 본인 프로필 조회
export const useGetUserMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => getUserMe(),
  });
};

// 사용자 프로필 초기 설정
export const useCreateUserProfile = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setUserId = useAuthStore((state) => state.setUserId);
  return useMutation({
    mutationFn: (profileData: object) => postUserProfile(profileData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile-complete'] });
      const { userId } = data;
      setUserId(userId);
      navigate('/');
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

// 프로필 완성 여부 조회
export const useGetIsUserProfileComplete = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: ['profile-complete'],
    queryFn: () => getIsUserProfileComplete(),
    enabled: !!accessToken,
    refetchOnWindowFocus: false,
  });
};
