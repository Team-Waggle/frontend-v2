import { POST_DETAIL_URL, POST_URL } from '../constants/endpoint';
import axiosInstance from './axiosInstance';

// 모집글 상세조회
export const GetPostDetail = async (postId: number) => {
  const { data } = await axiosInstance.get(POST_DETAIL_URL(postId));
  return data;
}

// 모집글 목록 페이지네이션
// 기본값: 12개씩, sort는 최신순
export const getPosts = async ({ q, page = 0 }: { q?: string; page?: number } = {}) => {
    const { data } = await axiosInstance.get(POST_URL, {
        params: {
            q,
            page,
            size: 4,
            sort: ["postId,desc"],
        },
    });

    return data;
};