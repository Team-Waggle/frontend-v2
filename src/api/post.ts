import axiosInstance from './axiosInstance';

import { POST_DETAIL_URL } from '../constants/endpoint';
import type { GetPostsParams, GetPostsResponse } from '../types/api/posts';

// 모집글 상세조회
export const getPostDetail = async (postId: number) => {
  const { data } = await axiosInstance.get(POST_DETAIL_URL(postId));
  return data;
};

// 모집글 목록 페이지네이션
export const getPosts = async (
  params: GetPostsParams,
): Promise<GetPostsResponse> => {
  const response = await axiosInstance.get<GetPostsResponse>('/posts', {
    params: {
      ...params,
      q: params.q || undefined,
    },
  });

  return response.data;
};
