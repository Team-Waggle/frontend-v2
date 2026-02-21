import axiosInstance from './axiosInstance';
import {
  USERS_ME_PROFILE_COMPLETION_URL,
  USERS_ME_PROFILE_URL,
  USERS_ME_URL,
  USERS_URL,
} from '../constants/endpoint';

// 사용자 조회
export const getUserDetail = async (userId: string) => {
  const { data } = await axiosInstance.get(USERS_URL(userId));
  return data;
};

// 본인 프로필 조회
export const getUserMe = async () => {
  const { data } = await axiosInstance.get(USERS_ME_URL);
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
