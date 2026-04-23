import { useNavigate } from 'react-router';
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createPosts,
  getPostDetail,
  getPosts,
  patchPostClose,
  updatePosts,
} from '../api/post';
import type {
  CursorResponsePostDetailResponse,
  PostsSort,
  RecruitmentStatusType,
} from '../types/api/posts';
import { usePatchTeamStatus } from './useTeam';

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

// 모집글 마감/모집 토글
export const usePatchPostClose = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      status,
    }: {
      postId: number;
      status: RecruitmentStatusType;
    }) => patchPostClose(postId, status),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['post-detail', postId] });
    },
  });
};

type UsePostsFilters = {
  q?: string;
  positions?: string[];
  skills?: string[];
  sort?: PostsSort;
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
  const sort = filters.sort ?? 'NEWEST';

  const keywordKey = keyword;
  const positionsKey = positionValues.join(',');
  const skillsKey = skillValues.join(',');
  const sortKey = sort;

  return useInfiniteQuery<CursorResponsePostDetailResponse>({
    queryKey: ['posts', keywordKey, positionsKey, skillsKey, sortKey],
    initialPageParam: undefined as number | undefined,
    queryFn: ({ pageParam }) => {
      const cursor = typeof pageParam === 'number' ? pageParam : undefined;

      return getPosts({
        q: keyword || undefined,
        positions: positionValues.length ? positionValues : undefined,
        skills: skillValues.length ? skillValues : undefined,
        cursor,
        sort,
        size: pageSize,
      });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.hasNext) {
        return undefined;
      }

      const next = lastPage.nextCursor;
      return typeof next === 'number' ? next : undefined;
    },
    refetchOnWindowFocus: false,
  });
};

// 모집글 작성
export const useCreatePosts = () => {
  const { mutate } = usePatchTeamStatus();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (postData: object) => createPosts(postData),
    onSuccess: (data) => {
      mutate({ teamId: data.team.teamId, status: 'ACTIVE' });
      navigate(`/team/${data.team.teamId}`);
    },
    onError: (err) => {
      console.error(err);
    },
  });
};

// 모집글 수정
export const useUpdatePosts = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({ postId, postData }: { postId: number; postData: object }) =>
      updatePosts(postId, postData),
    onSuccess: (data) => {
      navigate(`/post/${data.team.teamId}`);
    },
  });
};
