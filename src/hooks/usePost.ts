import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

import { getPostDetail, getPosts } from '../api/post';
import type { GetPostsResponse } from '../types/api/posts';

// 모집글 상세조회
export const useGetPostDetail = (postId: number) => {
  const isValidPostId = Number.isInteger(postId) && postId > 0;

  return useQuery({
    queryKey: ['post-detail', postId],
    queryFn: () => getPostDetail(postId),
    enabled: isValidPostId,
    refetchOnWindowFocus: false,
  });
};

// 모집글 목록 무한 스크롤 조회
export const usePostsInfinite = (q?: string) => {
  const pageSize = 10;

  return useInfiniteQuery<GetPostsResponse>({
    queryKey: ['posts', q || ''],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => {
      const page = typeof pageParam === 'number' ? pageParam : 0;

      return getPosts({
        page,
        size: pageSize,
        q,
      });
    },
    getNextPageParam: (lastPage) => {
      const pageNumber = Number(lastPage.number ?? 0);
      const totalPages = Number(lastPage.totalPages ?? 0);

      if (totalPages > 0) {
        if (pageNumber + 1 >= totalPages) return undefined;
        return pageNumber + 1;
      }

      const contentLength = Array.isArray(lastPage.content)
        ? lastPage.content.length
        : 0;

      if (contentLength < pageSize) return undefined;

      return pageNumber + 1;
    },
  });
};
