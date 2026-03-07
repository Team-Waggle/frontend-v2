import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

import { getPostDetail, getPosts } from '../api/post';
import type { CursorResponsePostDetailResponse } from '../types/api/posts';

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

type UsePostsFilters = {
  q?: string;
  positions?: string[];
  skills?: string[];
};

const trimKeyword = (value: string): string => value.trim();

const cleanFilterValues = (values: string[]): string[] => {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean)),
  ).sort();
};

// 모집글 목록 무한 스크롤 조회 (cursor 기반)
export const usePostsInfinite = (filters: UsePostsFilters = {}) => {
  const pageSize = 10;

  const keyword = trimKeyword(filters.q ?? '');
  const positionValues = cleanFilterValues(filters.positions ?? []);
  const skillValues = cleanFilterValues(filters.skills ?? []);

  const keywordKey = keyword;
  const positionsKey = positionValues.join(',');
  const skillsKey = skillValues.join(',');

  return useInfiniteQuery<CursorResponsePostDetailResponse>({
    queryKey: ['posts', keywordKey, positionsKey, skillsKey],
    initialPageParam: undefined as number | undefined,
    queryFn: ({ pageParam }) => {
      const cursor = typeof pageParam === 'number' ? pageParam : undefined;

      return getPosts({
        q: keyword || undefined,
        positions: positionValues.length ? positionValues : undefined,
        skills: skillValues.length ? skillValues : undefined,
        cursor,
        size: pageSize,
      });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.hasNext) return undefined;

      const next = lastPage.nextCursor;
      return typeof next === 'number' ? next : undefined;
    },
    refetchOnWindowFocus: false,
  });
};
