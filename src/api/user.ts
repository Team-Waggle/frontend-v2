import axiosInstance from './axiosInstance';
import type { MyApplicationResponse, UserMeResponse } from '../types/api/user';
import {
  USERS_CHECK_URL,
  USERS_ME_APPLICATIONS_URL,
  USERS_ME_NOTIFICATIONS_COUNT_URL,
  USERS_ME_NOTIFICATIONS_READ_ALL_URL,
  USERS_ME_NOTIFICATIONS_READ_URL,
  USERS_ME_NOTIFICATIONS_URL,
  USERS_ME_PRESIGNED_URL,
  USERS_ME_PROFILE_COMPLETION_URL,
  USERS_ME_PROFILE_URL,
  USERS_ME_TEAMS_URL,
  USERS_ME_TEAMS_VISIBILITY_URL,
  USERS_ME_URL,
  USERS_TEAMS_URL,
  USERS_URL,
} from '../constants/endpoint';
import type {
  CursorNotificationResponse,
  TeamResponse,
} from '../types/api/team';

// 사용자 조회
export const getUserDetail = async (
  userId: string,
): Promise<UserMeResponse> => {
  const { data } = await axiosInstance.get<UserMeResponse>(USERS_URL(userId));
  return data;
};

// 사용자명 사용 가능 여부 조회
export const getUserCheck = async (username: string) => {
  const { data } = await axiosInstance.get(
    `${USERS_CHECK_URL}?username=${username}`,
  );
  return data;
};

// 본인 지원 목록 조회
export const getUserMeApplications = async (): Promise<
  MyApplicationResponse[]
> => {
  const { data } = await axiosInstance.get<MyApplicationResponse[]>(
    USERS_ME_APPLICATIONS_URL,
  );
  return data;
};

// 본인 프로필 조회
export const getUserMe = async () => {
  const { data } = await axiosInstance.get(USERS_ME_URL);
  return data;
};

// 회원 탈퇴
export const deleteUserMe = async () => {
  const { data } = await axiosInstance.delete(USERS_ME_URL);
  return data;
};

// 사용자 프로필 초기 설정
export const postUserProfile = async (profileData: object) => {
  const { data } = await axiosInstance.post(USERS_ME_PROFILE_URL, profileData);
  return data;
};

// 프로필 완성 여부 조회
export const getIsUserProfileComplete = async () => {
  const { data } = await axiosInstance.get(USERS_ME_PROFILE_COMPLETION_URL);
  return data;
};

// 프로필 이미지 업로드용 Presigned URL 생성
export const postUserPresignedUrl = async (contentType: string) => {
  const { data } = await axiosInstance.post(USERS_ME_PRESIGNED_URL, {
    contentType: contentType,
  });
  return data;
};

// S3에 이미지 직접 업로드 (인증 헤더 불필요)
export const putUserProfileImageToS3 = async (
  presignedUrl: string,
  file: File,
) => {
  const contentType = file.type || 'application/octet-stream';
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': contentType },
  });
  if (!response.ok) {
    throw new Error(`S3 업로드 실패: ${response.status}`);
  }
};

// 본인 프로필 수정
export const putUserMe = async (profileData: object) => {
  const { data } = await axiosInstance.put(USERS_ME_URL, profileData);
  return data;
};

// 팀 공개 여부 변경
export const patchTeamVisibility = async (
  teamId: number,
  visible: boolean,
) => {
  const { data } = await axiosInstance.patch(
    USERS_ME_TEAMS_VISIBILITY_URL(teamId),
    { visible },
  );
  return data;
};

// 본인 참여 팀 목록 조회
export const getUserMeTeam = async (): Promise<TeamResponse[]> => {
  const { data } = await axiosInstance.get<TeamResponse[]>(USERS_ME_TEAMS_URL);
  return data;
};

// 사용자 참여 팀 목록 조회
export const getUserTeams = async (userId: string): Promise<TeamResponse[]> => {
  const { data } = await axiosInstance.get<TeamResponse[]>(
    USERS_TEAMS_URL(userId),
  );
  return data;
};

// 본인 알림 목록 조회
export const getNotifications = async () => {
  const { data } = await axiosInstance.get<CursorNotificationResponse>(
    USERS_ME_NOTIFICATIONS_URL,
  );
  return data;
};

// 본인 알림 개수 조회
export const getNotificationsCount = async () => {
  const { data } = await axiosInstance.get(USERS_ME_NOTIFICATIONS_COUNT_URL);
  return data;
};

// 알림 읽음 처리
export const patchNotificationsRead = async (notificationIds: number[]) => {
  const { data } = await axiosInstance.patch(USERS_ME_NOTIFICATIONS_READ_URL, {
    notificationIds,
  });
  return data;
};

// 본인 알림 전체 읽음 처리
export const patchNotificationsReadAll = async () => {
  const { data } = await axiosInstance.patch(
    USERS_ME_NOTIFICATIONS_READ_ALL_URL,
  );
  return data;
};
