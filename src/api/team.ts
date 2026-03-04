import { TEAMS_DETAIL_URL, TEAMS_PRESIGNED_URL, TEAMS_URL } from '../constants/endpoint';
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
  const { data } = await axiosInstance.get(TEAMS_DETAIL_URL(teamId));
  return data;
}