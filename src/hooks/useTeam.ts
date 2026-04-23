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
} from '../api/team';
import type { ApplyRequest } from '../types/api/posts';
import type { GetApplicationsParams } from '../types/api/team';

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
// export const useGetTeamApplications = (
//   teamId: number,
//   postId: number | null,
// ) => {
//   return useQuery({
//     queryKey: ['team-applications', teamId, postId],
//     queryFn: () => GetTeamApplications(teamId, postId),
//     enabled: !!teamId,
//     refetchOnWindowFocus: false,
//   });
// };
export const useGetTeamApplications = (
  params: Omit<GetApplicationsParams, 'cursor' | 'direction'>,
) => {
  return useInfiniteQuery({
    queryKey: ['team-applications', params.teamId, params.postId],
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
    enabled: !!params.teamId,
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
        queryKey: ['team-applicantions'],
      });
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
        queryKey: ['team-applicantions'],
      });
    },
  });
};
