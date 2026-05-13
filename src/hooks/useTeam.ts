import { useNavigate } from 'react-router';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  PostTeam,
  PostTeamImage,
  GetTeamDetail,
  GetTeamApplications,
  GetTeamMembers,
  PatchTeamMemberRole,
  DeleteTeamMember,
  GetTeamPosts,
  patchTeamStatus,
  PostTeamApplications,
  postTeamApplicationRead,
  patchTeamApplicationStatus,
  putTeamMemberReview,
  updateTeam,
  deleteTeam,
  leaveTeam,
} from '../api/team';
import type { ApplyRequest } from '../types/api/posts';
import type {
  GetApplicationsParams,
  ReviewRequestType,
} from '../types/api/team';

// 팀 생성
export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teamData: object) => PostTeam(teamData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user-me-team'],
      });
    },
  });
};

// 팀 수정
export const useUpdateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ teamId, teamData }: { teamId: number; teamData: object }) =>
      updateTeam(teamId, teamData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user-me-team'],
      });
    },
  });
};

// 팀 삭제
export const useDeleteTeam = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teamId: number) => deleteTeam(teamId),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['user-me-team'] });
      navigate('/');
    },
  });
};

// 팀 프로필 이미지 업로드용 Presigned URL 생성
export const useCreateTeamImage = () => {
  return useMutation({
    mutationFn: (contentType: string) => PostTeamImage(contentType),
  });
};

// 팀 상세조회
export const useGetTeamDetail = (teamId: number) => {
  const isValidTeamId = Number.isInteger(teamId) && teamId > 0;

  return useQuery({
    queryKey: ['team-detail', teamId],
    queryFn: () => GetTeamDetail(teamId),
    enabled: isValidTeamId,
    refetchOnWindowFocus: false,
  });
};

// 팀 지원 목록 조회
export const useGetTeamApplications = (
  params: Omit<GetApplicationsParams, 'cursor' | 'direction'>,
  options?: { enabled?: boolean },
) => {
  const isValidTeamId = !!params.teamId;

  return useInfiniteQuery({
    queryKey: ['team-applications', params.teamId, params.postId, params.size],
    queryFn: ({ pageParam }) =>
      GetTeamApplications({
        ...params,
        cursor: pageParam,
        direction: 'AFTER',
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNext) return undefined;
      return lastPage.nextCursor;
    },
    enabled: isValidTeamId && (options?.enabled ?? true),
    refetchOnWindowFocus: false,
  });
};

// 팀 지원
export const useCreateTeamApplications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      teamId,
      postData,
    }: {
      teamId: number;
      postData: ApplyRequest;
    }) => PostTeamApplications(teamId, postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
      queryClient.invalidateQueries({ queryKey: ['post-detail'] });
    },
  });
};

// 팀 모집글 목록 조회
export const useGetTeamPosts = (teamId: number) => {
  const isValidTeamId = Number.isInteger(teamId) && teamId > 0;

  return useQuery({
    queryKey: ['team-posts', teamId],
    queryFn: () => GetTeamPosts(teamId),
    enabled: isValidTeamId,
    refetchOnWindowFocus: false,
  });
};

// 팀 멤버 목록 조회
export const useGetTeamMembers = (teamId: number) => {
  const isValidTeamId = Number.isInteger(teamId) && teamId > 0;

  return useQuery({
    queryKey: ['team-members', teamId],
    queryFn: () => GetTeamMembers(teamId),
    enabled: isValidTeamId,
    refetchOnWindowFocus: false,
  });
};

// 팀 멤버 역할 변경
export const usePatchTeamMemberRole = (teamId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      role,
    }: {
      memberId: number;
      role: 'MANAGER' | 'MEMBER';
    }) => PatchTeamMemberRole(memberId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['team-members', teamId],
      });
    },
  });
};

// 팀 멤버 추방
export const useDeleteTeamMember = (teamId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: number) => DeleteTeamMember(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['team-members', teamId],
      });
    },
  });
};

// 팀원 리뷰 작성/수정
export const usePutTeamMemberReview = () => {
  return useMutation({
    mutationFn: ({
      memberId,
      reviewBody,
    }: {
      memberId: number;
      reviewBody: ReviewRequestType;
    }) => putTeamMemberReview(memberId, reviewBody),
  });
};

// 팀 상태 변경
export const usePatchTeamStatus = () => {
  return useMutation({
    mutationFn: ({ teamId, status }: { teamId: number; status: string }) =>
      patchTeamStatus(teamId, status),
  });
};

// 팀 지원 읽음 처리
export const usePostTeamApplicationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postTeamApplicationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['team-applications'],
      });
    },
  });
};

// 팀 탈퇴
export const useLeaveTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teamId: number) => leaveTeam(teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-me-team'] });
    },
  });
};

// 팀 지원 상태 변경
export const usePatchTeamApplicationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      applicantId,
      status,
    }: {
      applicantId: number;
      status: string;
    }) => patchTeamApplicationStatus(applicantId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['team-applications'],
      });
    },
  });
};
