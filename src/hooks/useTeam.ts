import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
} from '../api/team';

// 팀 생성
export const useCreateTeam = () => {
  return useMutation({
    mutationFn: (teamData: object) => PostTeam(teamData),
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
export const useGetTeamApplications = (teamId: number) => {
  const isValidTeamId = Number.isInteger(teamId) && teamId > 0;

  return useQuery({
    queryKey: ['team-applications', teamId],
    queryFn: () => GetTeamApplications(teamId),
    enabled: isValidTeamId,
    refetchOnWindowFocus: false,
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
