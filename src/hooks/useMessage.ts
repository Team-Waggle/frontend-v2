import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { getConversations, getMessages, readConversation } from '../api/message';
import { useAuthStore } from '../stores/authStore';

// 대화방 목록 무한 스크롤 (커서 기반)
export const useGetConversations = (q?: string) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useInfiniteQuery({
    queryKey: ['conversations', q],
    queryFn: ({ pageParam }) =>
      getConversations(pageParam as number | undefined, q),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
    enabled: !!accessToken,
    refetchOnWindowFocus: false,
  });
};

// 메시지 내역 - BEFORE 방향 (최신 → 과거, 위로 스크롤 시 이전 페이지 로드)
export const useGetMessages = (partnerId: string, initialCursor?: number) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useInfiniteQuery({
    queryKey:
      initialCursor !== undefined
        ? ['messages', partnerId, initialCursor]
        : ['messages', partnerId],
    queryFn: ({ pageParam }) =>
      getMessages(partnerId, pageParam as number | undefined, 'BEFORE'),
    initialPageParam: initialCursor as number | undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.hasNext ? (firstPage.nextCursor ?? undefined) : undefined,
    getNextPageParam: () => undefined,
    enabled: !!accessToken && !!partnerId,
    refetchOnWindowFocus: false,
  });
};

// 메시지 내역 - AFTER 방향 (커서 이후 메시지, 하이라이트 이동 시 최신까지 채우기)
export const useGetMessagesAfter = (partnerId: string, cursor: number | null) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useInfiniteQuery({
    queryKey: ['messages', partnerId, 'after', cursor],
    queryFn: ({ pageParam }) =>
      getMessages(partnerId, pageParam as number | undefined, 'AFTER'),
    initialPageParam: cursor as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
    getPreviousPageParam: () => undefined,
    enabled: !!accessToken && !!partnerId && cursor !== null,
    refetchOnWindowFocus: false,
  });
};

// 읽음 처리
export const useReadConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (partnerId: string) => readConversation(partnerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};
