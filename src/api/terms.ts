import { TERMS_AGREE_URL, TERMS_URL } from '../constants/endpoint';
import type { TermResponse, TermsAgreeRequest } from '../types/api/term';
import axiosInstance from './axiosInstance';

// 약관 목록 조회
export const getTerms = async (): Promise<TermResponse[]> => {
  const { data } = await axiosInstance.get(TERMS_URL);
  return data;
};

// 약관 동의
export const postTerms = async (payload: TermsAgreeRequest) => {
  const { data } = await axiosInstance.post(TERMS_AGREE_URL, payload);
  return data;
};
