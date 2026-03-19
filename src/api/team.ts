import {
  TEAMS_DETAIL_URL,
  TEAMS_PRESIGNED_URL,
  TEAMS_URL,
  TEAMS_MEMBERS_URL,
  TEAMS_RECRUITMENTS_URL,
  MEMBER_URL,
  TEAMS_APPLICATION_URL,
} from '../constants/endpoint';
import type { TeamResponse, MemberResponse } from '../types/api/team';
import type { PostDetailResponse } from '../types/api/posts';
import axiosInstance from './axiosInstance';

// 팀 생성
export const PostTeam = async (teamData: object) => {
  const { data } = await axiosInstance.post(TEAMS_URL, teamData);
  return data;
};

// 팀 프로필 이미지 업로드용 Presigned URL 생성
export const PostTeamImage = async (contentType: string) => {
  const { data } = await axiosInstance.post(TEAMS_PRESIGNED_URL, {
    contentType: contentType,
  });
  return data;
};

// 팀 상세 조회
export const GetTeamDetail = async (teamId: number) => {
  const { data } = await axiosInstance.get<TeamResponse>(
    TEAMS_DETAIL_URL(teamId),
  );
  return data;
};

// 팀 지원 목록 조회
export const GetTeamApplications = async (teamId: number) => {
  const { data } = await axiosInstance.get<PostDetailResponse[]>(
    TEAMS_APPLICATION_URL(teamId),
  );
  return data;
};

// 팀 모집글 목록 조회
export const GetTeamPosts = async (teamId: number) => {
  const { data } = await axiosInstance.get<PostDetailResponse[]>(
    TEAMS_RECRUITMENTS_URL(teamId),
  );
  return data;
};

// 팀 멤버 목록 조회
export const GetTeamMembers = async (teamId: number) => {
  const { data } = await axiosInstance.get<MemberResponse[]>(
    TEAMS_MEMBERS_URL(teamId),
  );
  return data;
};

// 팀 멤버 역할 변경
export const PatchTeamMemberRole = async (
  memberId: number,
  role: 'MANAGER' | 'MEMBER',
) => {
  const { data } = await axiosInstance.patch(MEMBER_URL(memberId), {
    role,
  });
  return data;
};

// 팀 멤버 추방
export const DeleteTeamMember = async (memberId: number) => {
  const { data } = await axiosInstance.delete(MEMBER_URL(memberId));
  return data;
};
