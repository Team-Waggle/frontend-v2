import { useQuery } from '@tanstack/react-query';
import { GetPostDetail } from '../api/post';

// 모집글 상세조회
export const useGetPostDetail = (postId: number) => {
  const isValidPostId = Number.isInteger(postId) && postId > 0;

  return useQuery({
    queryKey: ['post-detail', postId],
    queryFn: () => GetPostDetail(postId),
    enabled: isValidPostId,
    refetchOnWindowFocus: false,
  });
};