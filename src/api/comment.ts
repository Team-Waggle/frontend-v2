import axiosInstance from './axiosInstance';
import {
  COMMENT_DETAIL_URL,
  COMMENTS_LIKE_URL,
  COMMENT_URL,
} from '../constants/endpoint';

// 댓글 수정
export const updateComment = async (commentId: number, postData: object) => {
  const { data } = await axiosInstance.put(
    COMMENT_DETAIL_URL(commentId),
    postData,
  );
  return data;
};

// 댓글 삭제
export const deleteComment = async (commentId: number): Promise<void> => {
  const { data } = await axiosInstance.delete(COMMENT_DETAIL_URL(commentId));
  return data;
};

// 댓글 목록 커서 기반 조회
export const getComment = async (postId: number) => {
  const { data } = await axiosInstance.get(COMMENT_URL(postId));
  return data;
};

// 댓글 답글 작성
export const postComment = async (postId: number, commentData: object) => {
  const { data } = await axiosInstance.post(COMMENT_URL(postId), commentData);
  return data;
};

// 댓글 좋아요
export const likeComment = async (commentId: number) => {
  const { data } = await axiosInstance.put(COMMENTS_LIKE_URL(commentId));
  return data;
};

// 댓글 좋아요 취소
export const unlikeComment = async (commentId: number) => {
  const { data } = await axiosInstance.delete(COMMENTS_LIKE_URL(commentId));
  return data;
};
