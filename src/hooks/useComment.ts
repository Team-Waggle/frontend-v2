import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteComment,
  getComment,
  likeComment,
  postComment,
  unlikeComment,
  updateComment,
} from '../api/comment';

// 댓글 수정
export const useUpdateComment = (commentId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postData: object) => updateComment(commentId, postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comment'] });
    },
  });
};

// 댓글 삭제
export const useDeleteComment = (commentId: number, postId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comment'] });
      queryClient.invalidateQueries({ queryKey: ['post-detail', postId] });
    },
  });
};

// 댓글 목록 커서 기반 조회
export const useGetComment = (postId: number) => {
  return useQuery({
    queryKey: ['comment', postId],
    queryFn: () => getComment(postId!),
    refetchOnWindowFocus: false,
  });
};

// 댓글 답글 작성
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      commentData,
    }: {
      postId: number;
      commentData: object;
    }) => postComment(postId, commentData),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['comment'] });
      queryClient.invalidateQueries({ queryKey: ['post-detail', postId] });
    },
    onError: (err) => {
      console.error(err);
    },
  });
};

// 댓글 좋아요
export const useLikeComment = (commentId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => likeComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comment'] });
    },
  });
};

// 댓글 좋아요 취소
export const useUnlikeComment = (commentId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => unlikeComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comment'] });
    },
  });
};
