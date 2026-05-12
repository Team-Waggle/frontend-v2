import {
  TEAMS_DETAIL_URL,
  TEAMS_PRESIGNED_URL,
  TEAMS_URL,
  TEAMS_MEMBERS_URL,
  TEAMS_RECRUITMENTS_URL,
  MEMBER_URL,
  TEAMS_APPLICATION_URL,
  TEAMS_STATUS_URL,
  APPLICATION_DELETE_URL,
  APPLICATION_READ_URL,
  APPLICATION_STATUS_URL,
  MEMBER_REVIEW_URL,
} from '../constants/endpoint';
import type {
  TeamResponse,
  MemberResponse,
  CursorResponseApplicantResponse,
  GetApplicationsParams,
  ReviewRequestType,
} from '../types/api/team';
import type { ApplyRequest, PostDetailResponse } from '../types/api/posts';
import axiosInstance from './axiosInstance';

// 팀 생성
export const PostTeam = async (teamData: object) => {
  const { data } = await axiosInstance.post(TEAMS_URL, teamData);
  return data;
};

// 팀 수정
export const updateTeam = async (teamId: number, teamData: object) => {
  const { data } = await axiosInstance.put(TEAMS_DETAIL_URL(teamId), teamData);
  return data;
};

// 팀 삭제
export const deleteTeam = async (teamId: number) => {
  const { data } = await axiosInstance.delete(TEAMS_DETAIL_URL(teamId));
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
export const GetTeamApplications = async ({
  teamId,
  postId,
  cursor,
  size = 9,
  direction,
}: GetApplicationsParams) => {
  const { data } = await axiosInstance.get<CursorResponseApplicantResponse>(
    TEAMS_APPLICATION_URL(teamId),
    {
      params: {
        postId: postId ?? undefined,
        cursor,
        size,
        direction,
      },
    },
  );
  return data;
};

// 팀 지원
export const PostTeamApplications = async (
  teamId: number,
  postData: ApplyRequest,
) => {
  const { data } = await axiosInstance.post(
    TEAMS_APPLICATION_URL(teamId),
    postData,
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

// 팀원 리뷰 작성/수정
export const putTeamMemberReview = async (
  memberId: number,
  reviewBody: ReviewRequestType,
) => {
  const { data } = await axiosInstance.put(
    MEMBER_REVIEW_URL(memberId),
    reviewBody,
  );
  return data;
};

// 팀 상태 변경
export const patchTeamStatus = async (teamId: number, status: string) => {
  const { data } = await axiosInstance.patch(TEAMS_STATUS_URL(teamId), {
    status,
  });
  return data;
};

// 팀 지원 읽음 처리
export const postTeamApplicationRead = async (applicationId: number) => {
  const { data } = await axiosInstance.post(
    APPLICATION_READ_URL(applicationId),
  );
  return data;
};

// 팀 지원 상태 변경
export const patchTeamApplicationStatus = async (
  applicationId: number,
  status: string,
) => {
  const { data } = await axiosInstance.patch(
    APPLICATION_STATUS_URL(applicationId),
    { status },
  );
  return data;
};

// 팀 지원 취소
export const deleteApplication = async (applicationId: number) => {
  const { data } = await axiosInstance.delete(APPLICATION_DELETE_URL(applicationId));
  return data;
};

// 팀 탈퇴
export const leaveTeam = async (teamId: number) => {
  const { data } = await axiosInstance.delete(TEAMS_MEMBERS_URL(teamId));
  return data;
};
