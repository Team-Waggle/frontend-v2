import axios from 'axios';
import {
  BASE_URL,
  LOGOUT_URL,
  OAUTH_REDEEM_URL,
  REFRESH_TOKEN_URL,
} from '../constants/endpoint';
import axiosInstance from './axiosInstance';

// 로그아웃
export const postLogout = async () => {
  const { data } = await axiosInstance.post(LOGOUT_URL);
  return data;
};

// 액세스 토큰 재발급
export const postRefresh = async () => {
  const { data } = await axios.post(
    `${BASE_URL}${REFRESH_TOKEN_URL}`,
    {},
    { withCredentials: true },
  );
  return data;
};

// OAuth 콜백 OTT를 액세스 토큰으로 교환 (1회용, 1분 만료)
export const postOAuthRedeem = async (ott: string): Promise<{ accessToken: string }> => {
  const { data } = await axios.post(
    `${BASE_URL}${OAUTH_REDEEM_URL}`,
    { ott },
    { withCredentials: true },
  );
  return data;
};
