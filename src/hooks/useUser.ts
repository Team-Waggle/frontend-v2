import { useNavigate } from 'react-router';
import { useAuthStore } from '../stores/authStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { TeamResponse } from '../types/api/team';
import type { UserMeResponse } from '../types/api/user';
import {
  getUserDetail,
  getUserMe,
  getUserMeApplications,
  getIsUserProfileComplete,
  postUserProfile,
  getUserMeTeam,
  getUserTeams,
  patchTeamVisibility,
  postUserPresignedUrl,
  putUserProfileImageToS3,
  putUserMe,
  deleteUserMe,
  patchNotificationsReadAll,
  getNotifications,
  getNotificationsCount,
  patchNotificationsRead,
} from '../api/user';
import { deleteApplication } from '../api/team';

// 사용자 조회
export const useGetUserDetail = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserDetail(userId!),
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });
};

// 본인 지원 목록 조회
export const useGetMyApplications = () => {
  const { accessToken } = useAuthStore();
  const { data: profileStatus } = useGetIsUserProfileComplete();

  return useQuery({
    queryKey: ['my-applications'],
    queryFn: getUserMeApplications,
    enabled: !!accessToken && !!profileStatus?.complete,
    refetchOnWindowFocus: false,
  });
};

// 지원 취소
export const useDeleteApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: number) => deleteApplication(applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
    },
  });
};

// 본인 프로필 조회
export const useGetUserMe = () => {
  const { accessToken } = useAuthStore();
  return useQuery({
    queryKey: ['me'],
    queryFn: () => getUserMe(),
    enabled: !!accessToken,
    refetchOnWindowFocus: false,
  });
};

// 본인 프로필 수정
export const usePutUserMe = () => {
  return useMutation({
    mutationFn: (profileData: object) => putUserMe(profileData),
  });
};

// 회원 탈퇴
export const useDeleteUserMe = () => {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  return useMutation({
    mutationFn: deleteUserMe,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['me'] });
      logout();
      navigate('/');
    },
  });
};

// 사용자 프로필 초기 설정
export const useCreateUserProfile = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (profileData: object) => postUserProfile(profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile-complete'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
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

// 프로필 이미지 업로드 (presigned URL → S3 PUT → 프로필 PUT)
export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const me = queryClient.getQueryData<UserMeResponse>(['me']);
      if (!me) throw new Error('사용자 정보를 불러올 수 없습니다.');
      const { presignedUrl, objectUrl } = await postUserPresignedUrl(file.type);
      await putUserProfileImageToS3(presignedUrl, file);
      await putUserMe({
        username: me.username,
        position: me.position,
        bio: me.bio,
        skills: me.skills,
        portfolioUrls: me.portfolioUrls,
        profileImageUrl: objectUrl,
      });
      return objectUrl;
    },
    onSuccess: (_objectUrl, _file, _ctx) => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

// 팀 공개 여부 변경
export const usePatchTeamVisibility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      teamId,
      visible,
    }: {
      teamId: number;
      visible: boolean;
    }) => patchTeamVisibility(teamId, visible),
    onMutate: async ({ teamId, visible }) => {
      await queryClient.cancelQueries({ queryKey: ['user-me-team'] });
      const previous = queryClient.getQueryData<TeamResponse[]>([
        'user-me-team',
      ]);
      queryClient.setQueryData<TeamResponse[]>(['user-me-team'], (old) =>
        old?.map((team) =>
          team.id === teamId ? { ...team, visible } : team,
        ),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(['user-me-team'], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user-me-team'] });
    },
  });
};

// 본인 참여 팀 목록 조회
export const useGetUserMeTeam = () => {
  const { accessToken } = useAuthStore();
  const { data: profileStatus } = useGetIsUserProfileComplete();

  return useQuery({
    queryKey: ['user-me-team'],
    queryFn: () => getUserMeTeam(),
    enabled: !!accessToken && !!profileStatus?.complete,
    refetchOnWindowFocus: false,
  });
};

// 사용자 참여 팀 목록 조회
export const useGetUserTeams = (userId: string) => {
  return useQuery({
    queryKey: ['user-teams', userId],
    queryFn: () => getUserTeams(userId),
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });
};

// 본인 알림 목록 조회
export const useGetNotifications = () => {
  return useQuery({
    queryKey: ['my-notifications'],
    queryFn: getNotifications,
    refetchOnWindowFocus: false,
  });
};

// 본인 알림 개수 조회
export const useGetNotificationsCount = () => {
  return useQuery({
    queryKey: ['my-notifications-count'],
    queryFn: getNotificationsCount,
    refetchOnWindowFocus: false,
  });
};

// 본인 알림 읽음 처리
export const usePatchNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationIds: number[]) =>
      patchNotificationsRead(notificationIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['my-notifications-count'] });
    },
  });
};

// 본인 알림 전체 읽음 처리
export const usePatchNotificationsReadAll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchNotificationsReadAll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['my-notifications-count'] });
    },
  });
};
