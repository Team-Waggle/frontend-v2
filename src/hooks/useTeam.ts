import { useMutation, useQuery } from '@tanstack/react-query';
import { PostTeam, PostTeamImage, GetTeamDetail } from '../api/team';

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
