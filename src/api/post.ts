import axiosInstance from './axiosInstance';

import { POST_DETAIL_URL } from '../constants/endpoint';
import type {
  GetPostsParams,
  CursorResponsePostDetailResponse,
  GetPostDetailResponse,
} from '../types/api/posts';

// 모집글 상세조회
export const getPostDetail = async (
  postId: number,
): Promise<GetPostDetailResponse> => {
  const { data } = await axiosInstance.get<GetPostDetailResponse>(
    POST_DETAIL_URL(postId),
  );
  return data;
};

// 모집글 목록 커서 기반 조회
export const getPosts = async (
  params: GetPostsParams,
): Promise<CursorResponsePostDetailResponse> => {
  const response = await axiosInstance.get<CursorResponsePostDetailResponse>(
    '/posts',
    {
      params: {
        q: params.q || undefined,
        positions: params.positions?.length ? params.positions : undefined,
        skills: params.skills?.length ? params.skills : undefined,
        cursor: typeof params.cursor === 'number' ? params.cursor : undefined,
        size: typeof params.size === 'number' ? params.size : undefined,
      },
    },
  );

  return response.data;
};
