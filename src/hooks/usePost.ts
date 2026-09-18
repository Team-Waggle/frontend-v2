import { useNavigate } from 'react-router';
import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createPosts,
  deletePost,
  getPostDetail,
  getPosts,
  likePost,
  patchPostClose,
  postPostImage,
  unlikePost,
  updatePosts,
} from '../api/post';
import type {
  CursorResponsePostDetailResponse,
  PostDetailResponse,
  PostsSort,
  RecruitmentStatusType,
} from '../types/api/posts';
import { usePatchTeamStatus } from './useTeam';

const POST_DETAIL_STALE_TIME = 1000 * 60 * 5;

export const postDetailQueryOptions = (postId: number) => ({
  queryKey: ['post-detail', postId] as const,
  queryFn: () => getPostDetail(postId),
  staleTime: POST_DETAIL_STALE_TIME,
  refetchOnWindowFocus: false,
});

// 모집글 상세조회
export const useGetPostDetail = (postId: number) => {
  const isValidPostId = Number.isInteger(postId) && postId > 0;

  return useQuery({
    ...postDetailQueryOptions(postId),
    enabled: isValidPostId,
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

// 모집글 좋아요
export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => likePost(postId),
    onSuccess: (_, postId) => {
      // post-detail은 조회 시 조회수가 올라가므로 invalidate(재조회) 대신 캐시를 직접 갱신
      queryClient.setQueryData<PostDetailResponse>(
        ['post-detail', postId],
        (prev) =>
          prev ? { ...prev, liked: true, likeCount: prev.likeCount + 1 } : prev,
      );
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['team-posts'] });
    },
  });
};

// 모집글 좋아요 취소
export const useUnlikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => unlikePost(postId),
    onSuccess: (_, postId) => {
      queryClient.setQueryData<PostDetailResponse>(
        ['post-detail', postId],
        (prev) =>
          prev
            ? {
                ...prev,
                liked: false,
                likeCount: Math.max(0, prev.likeCount - 1),
              }
            : prev,
      );
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['team-posts'] });
    },
  });
};

// 모집글 본문 이미지 업로드용 Presigned URL 생성
export const useCreatePostImage = () => {
  return useMutation({
    mutationFn: (contentType: string) => postPostImage(contentType),
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
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => {
      return getPosts({
        q: keyword || undefined,
        positions: positionValues.length ? positionValues : undefined,
        skills: skillValues.length ? skillValues : undefined,
        cursor: pageParam as string | undefined,
        sort,
        size: pageSize,
      });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.hasNext) {
        return undefined;
      }

      return lastPage.nextCursor ?? undefined;
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
      if (data.team.status === 'PREPARING') {
        mutate({ teamId: data.team.id, status: 'ACTIVE' });
      }
      navigate(`/team/${data.team.id}`);
    },
    onError: (err) => {
      console.error(err);
    },
  });
};

// 모집글 수정
export const useUpdatePosts = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({ postId, postData }: { postId: number; postData: object }) =>
      updatePosts(postId, postData),
    onSuccess: (data, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['post-detail', postId] });

      navigate(`/post/${data.id}`);
    },
  });
};

// 모집글 삭제
export const useDeletePost = (teamId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-posts', teamId] });
    },
  });
};
