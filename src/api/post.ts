import { POST_DETAIL_URL } from '../constants/endpoint';
import axiosInstance from './axiosInstance';

// 모집글 상세조회
export const GetPostDetail = async (postId: number) => {
  const { data } = await axiosInstance.get(POST_DETAIL_URL(postId));
  return data;
}