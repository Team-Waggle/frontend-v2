import axiosInstance from './axiosInstance';

import {
  POST_DETAIL_URL,
  POST_URL,
  POST_STATUS_URL,
  POST_PRESIGNED_URL,
} from '../constants/endpoint';

import type {
  GetPostsParams,
  CursorResponsePostDetailResponse,
  GetPostDetailResponse,
  RecruitmentStatusType,
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

// 모집글 마감/모집 토글
export const patchPostClose = async (
  postId: number,
  status: RecruitmentStatusType,
): Promise<void> => {
  await axiosInstance.patch(POST_STATUS_URL(postId), { status });
};

// 모집글 본문 이미지 업로드용 Presigned URL 생성
export const postPostImage = async (contentType: string) => {
  const { data } = await axiosInstance.post(POST_PRESIGNED_URL, {
    contentType,
  });
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
        sort: params.sort || undefined,
      },
    },
  );

  return response.data;
};

// 모집글 작성
export const createPosts = async (postData: object) => {
  const { data } = await axiosInstance.post(POST_URL, postData);
  return data;
};

// 모집글 수정
export const updatePosts = async (postId: number, postData: object) => {
  const { data } = await axiosInstance.put(POST_DETAIL_URL(postId), postData);
  return data;
};

// 모집글 삭제
export const deletePost = async (postId: number): Promise<void> => {
  await axiosInstance.delete(POST_DETAIL_URL(postId));
};
