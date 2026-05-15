import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';
import { useLocation } from 'react-router';

import { useGetConversations, useGetMessages, useGetMessagesAfter, useReadConversation } from './useMessage';
import { useGetUserDetail, useGetUserMe } from './useUser';
import { TEMP_ID_BASE, useMessageStore } from '../stores/messageStore';
import type { ConversationResponse, CursorResponse, MessageResponse } from '../types/api/message';
import { formatKstHhMm, formatKstYyyyMmDd } from '../utils/kst-time';

const HISTORY_REFETCH_DELAY_MS = 800;

export interface BubbleGroup {
  isMine: boolean;
  contents: string[];
  time: string;
  profileImageUrl?: string | null;
  key: number;
  messageIds: number[];
  isTemp: boolean;
}

export interface GroupedMessages {
  date: string;
  bubbleGroups: BubbleGroup[];
}

/**
 * ChatArea와 ModalChatView의 공통 채팅 로직을 담당
 * @param partnerId
 * @param highlight
 */
export const useChatLogic = (partnerId: string, highlight?: string | null) => {
  const queryClient = useQueryClient();
  const { data: me } = useGetUserMe();
  const { data: partnerDetail } = useGetUserDetail(partnerId);
  const location = useLocation();
  const locationState = location.state as {
    username?: string;
    position?: string;
    profileImageUrl?: string;
  } | null;

  const scrollRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef(0);
  const initialScrollDoneRef = useRef(false);
  const highlightHandledRef = useRef<string | null>(null);
  const tempIdCounterRef = useRef(0);
  const lastSentAtRef = useRef(0);
  const isAtBottomRef = useRef(true);

  const [inputValue, setInputValue] = useState('');

  const { realtimeMessages, failedTempIds, appendRealtimeMessage, markTempFailed, queueRetry, publish, removeFailedTemps, requestReconnect } =
    useMessageStore();
  const { mutate: readConversation } = useReadConversation();

  // highlight가 있으면 해당 messageId 기준으로 BEFORE 방향 첫 페이지를 시작
  const highlightCursor = useMemo(() => {
    if (!highlight) return null;
    const id = parseInt(highlight, 10);
    return isNaN(id) ? null : id;
  }, [highlight]);

  const {
    data: historyData,
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage,
  } = useGetMessages(
    partnerId,
    highlightCursor !== null ? highlightCursor + 1 : undefined,
  );

  // highlight 모드에서 커서 이후(newer) 메시지를 채우기 위한 AFTER 방향 쿼리
  const {
    data: highlightAfterMessages,
    fetchNextPage: fetchNextAfterPage,
    hasNextPage: hasNextAfterPage,
    isFetchingNextPage: isFetchingNextAfterPage,
  } = useGetMessagesAfter(partnerId, highlightCursor);

  const { data: conversationsData } = useGetConversations();

  // REST 히스토리 평탄화 + 시간순 정렬 (BEFORE 방향: 페이지·항목 모두 역순)
  const historyMessages: MessageResponse[] = useMemo(() => {
    const pages = historyData?.pages ?? [];
    return [...pages].reverse().flatMap((page) => [...page.data].reverse());
  }, [historyData]);

  // AFTER 방향 메시지 평탄화 (AFTER 방향: 오래된 순 정렬 그대로)
  const afterMessages: MessageResponse[] = useMemo(() => {
    const pages = highlightAfterMessages?.pages ?? [];
    return pages.flatMap((page) => page.data);
  }, [highlightAfterMessages]);

  // historyData 또는 afterData 갱신 시 임시 메시지 제거 — 서버에서 확인된 메시지만 제거
  useEffect(() => {
    if (historyMessages.length === 0 && afterMessages.length === 0) return;
    const tempMsgs = useMessageStore
      .getState()
      .realtimeMessages.filter((m) => m.id >= TEMP_ID_BASE);
    if (tempMsgs.length === 0) return;
    const combined = [...historyMessages, ...afterMessages];
    const allConfirmed = tempMsgs.every((temp) => {
      const tempTime = new Date(temp.createdAt).getTime();
      return combined.some(
        (h) =>
          h.content === temp.content &&
          String(h.sender.id) === String(temp.sender.id) &&
          Math.abs(new Date(h.createdAt).getTime() - tempTime) < 30_000,
      );
    });
    if (allConfirmed) useMessageStore.getState().clearTempMessages();
  }, [historyMessages, afterMessages]);

  // messageId 기준 deduplication + 현재 파트너 메시지만 포함
  const allMessages: MessageResponse[] = useMemo(() => {
    const map = new Map<number, MessageResponse>();
    const partnerIdStr = String(partnerId);
    const relevantRealtime = realtimeMessages.filter(
      (m) =>
        String(m.sender.id) === partnerIdStr ||
        String(m.receiver.id) === partnerIdStr,
    );
    const realtimeToInclude = hasNextAfterPage
      ? relevantRealtime.filter((m) => m.id >= TEMP_ID_BASE)
      : relevantRealtime;
    [...historyMessages, ...afterMessages, ...realtimeToInclude].forEach((m) =>
      map.set(m.id, m),
    );
    return [...map.values()].sort((a, b) => a.id - b.id);
  }, [historyMessages, afterMessages, realtimeMessages, partnerId, hasNextAfterPage]);

  // 파트너 정보
  const partnerInfo = useMemo(() => {
    const fromConversations = conversationsData?.pages
      .flatMap((p) => p.data)
      .find((c) => c.partner.id === partnerId)?.partner;
    if (fromConversations) return fromConversations;
    const fromMessages =
      allMessages.find((m) => m.sender.id === partnerId && m.sender.username)?.sender ??
      allMessages.find((m) => m.receiver.id === partnerId && m.receiver.username)?.receiver ??
      null;
    if (fromMessages) return fromMessages;
    if (locationState?.username) {
      return {
        id: partnerId,
        username: locationState.username,
        position: locationState.position ?? null,
        profileImageUrl: locationState.profileImageUrl ?? null,
      };
    }
    if (partnerDetail) {
      return {
        id: partnerDetail.id,
        username: partnerDetail.username,
        position: partnerDetail.position ?? null,
        profileImageUrl: partnerDetail.profileImageUrl ?? null,
      };
    }
    return null;
  }, [conversationsData, allMessages, partnerId, locationState, partnerDetail]);

  // 날짜별 그룹핑 / 같은 발신자, 같은 시각 연속 메시지를 하나의 버블로 묶기
  const groupedMessages: GroupedMessages[] = useMemo(() => {
    const dateGroups: { date: string; messages: MessageResponse[] }[] = [];
    allMessages.forEach((msg) => {
      const date = formatKstYyyyMmDd(msg.createdAt);
      const last = dateGroups[dateGroups.length - 1];
      if (last?.date === date) {
        last.messages.push(msg);
      } else {
        dateGroups.push({ date, messages: [msg] });
      }
    });

    return dateGroups.map(({ date, messages }) => {
      const bubbleGroups: BubbleGroup[] = [];
      messages.forEach((msg) => {
        const isMine = msg.sender.id === me?.id;
        const time = formatKstHhMm(msg.createdAt);
        const isTemp = msg.id >= TEMP_ID_BASE;
        const last = bubbleGroups[bubbleGroups.length - 1];
        if (last && last.isMine === isMine && last.time === time) {
          last.contents.push(msg.content);
          last.messageIds.push(msg.id);
          if (isTemp) last.isTemp = true;
        } else {
          bubbleGroups.push({
            isMine,
            contents: [msg.content],
            time,
            profileImageUrl: msg.sender.profileImageUrl,
            key: msg.id,
            messageIds: [msg.id],
            isTemp,
          });
        }
      });
      return { date, bubbleGroups };
    });
  }, [allMessages, me?.id]);

  // 스크롤 감지 → 바닥 여부 기록 + 위로 올리면 과거 로드 + 내리면 이후 로드
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isAtBottomRef.current = distFromBottom < 100;

    if (el.scrollTop < 50 && hasPreviousPage && !isFetchingPreviousPage) {
      prevScrollHeightRef.current = el.scrollHeight;
      fetchPreviousPage();
    }

    // highlight 모드에서 아래로 스크롤 시 커서 이후 메시지 추가 로드
    if (distFromBottom < 50 && hasNextAfterPage && !isFetchingNextAfterPage) {
      fetchNextAfterPage();
    }
  };

  // overflow-anchor: none 상태에서 로딩 스피너 출현/소멸 시 viewport 보정 (날짜 깜빡임 방지)
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || prevScrollHeightRef.current === 0) return;
    const diff = el.scrollHeight - prevScrollHeightRef.current;
    if (diff > 0) {
      el.scrollTop += diff;
      prevScrollHeightRef.current = el.scrollHeight;
    }
  }, [isFetchingPreviousPage]);

  // 과거 메시지 로드 후 스크롤 위치 보존
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || prevScrollHeightRef.current === 0) return;
    const diff = el.scrollHeight - prevScrollHeightRef.current;
    el.scrollTop += diff;
    prevScrollHeightRef.current = 0;
  }, [historyData]);

  const lastMessageId = allMessages[allMessages.length - 1]?.id;

  // 첫 로드 / 새 메시지 수신·전송 시 최하단 스크롤 (highlight 있으면 해당 메시지로 이동)
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || allMessages.length === 0) return;

    if (highlight && highlightHandledRef.current !== highlight) {
      const target = document.getElementById(`msg-${highlight}`);
      if (target) {
        target.scrollIntoView({ block: 'center' });
        highlightHandledRef.current = highlight;
        initialScrollDoneRef.current = true;
        return;
      }
    }

    if (!initialScrollDoneRef.current) {
      el.scrollTop = el.scrollHeight;
      initialScrollDoneRef.current = true;
    } else if (isAtBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [lastMessageId, highlight]);

  // 대화방 입장 시 읽음 처리
  useEffect(() => {
    const timer = setTimeout(() => readConversation(partnerId), 200);
    return () => clearTimeout(timer);
  }, [partnerId, readConversation]);

  // partnerId 변경 시 스크롤·하이라이트 플래그 초기화
  useEffect(() => {
    initialScrollDoneRef.current = false;
    highlightHandledRef.current = null;
    isAtBottomRef.current = true;
  }, [partnerId]);

  // 대화방을 떠날 때 messages 캐시 제거 → 재입장 시 항상 최신부터 fetch
  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ['messages', partnerId] });
    };
  }, [partnerId, queryClient]);

  const handleSend = () => {
    const now = Date.now();
    if (now - lastSentAtRef.current < 100) return;

    const content = inputValue.trim();
    if (!content) return;

    lastSentAtRef.current = now;
    setInputValue('');
    removeFailedTemps();

    const tempId = TEMP_ID_BASE + (++tempIdCounterRef.current);
    const createdAt = new Date().toISOString();

    // 전송 즉시 임시 메시지로 화면에 표시
    if (me) {
      appendRealtimeMessage({
        id: tempId,
        sender: {
          id: me.id,
          username: me.username,
          profileImageUrl: me.profileImageUrl,
          position: me.position,
        },
        receiver: { id: partnerId, username: null, profileImageUrl: null, position: '' },
        content,
        createdAt: createdAt,
        readAt: null,
      });

      // 대화 목록 낙관적 업데이트
      const updatedLastMessage = { id: tempId, content, createdAt: createdAt };
      const conversationsCache = queryClient.getQueryData<InfiniteData<CursorResponse<ConversationResponse>>>(['conversations', undefined]);
      const exists = conversationsCache?.pages.some((page) =>
        page.data.some((conv) => String(conv.partner.id) === String(partnerId)),
      );

      if (exists) {
        queryClient.setQueryData<InfiniteData<CursorResponse<ConversationResponse>>>(
          ['conversations', undefined],
          (old) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                data: page.data.map((conv) =>
                  String(conv.partner.id) === String(partnerId)
                    ? { ...conv, lastMessage: updatedLastMessage }
                    : conv,
                ),
              })),
            };
          },
        );
      } else if (partnerInfo && conversationsCache) {
        const newConversation: ConversationResponse = {
          partner: {
            id: partnerInfo.id,
            username: partnerInfo.username,
            profileImageUrl: partnerInfo.profileImageUrl,
            position: partnerInfo.position ?? '',
          },
          unreadCount: 0,
          lastReadMessageId: null,
          lastMessage: updatedLastMessage,
        };
        queryClient.setQueryData<InfiniteData<CursorResponse<ConversationResponse>>>(
          ['conversations', undefined],
          (old) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page, idx) =>
                idx === 0 ? { ...page, data: [newConversation, ...page.data] } : page,
              ),
            };
          },
        );
      }
    }

    const sent = publish(partnerId, content);
    if (!sent) {
      markTempFailed(tempId);
      queueRetry(partnerId, content, tempId);
      requestReconnect();
      return;
    }

    prevScrollHeightRef.current = 0;

    // 서버 저장 완료 후 히스토리 및 대화 목록 갱신
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['messages', partnerId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }, HISTORY_REFETCH_DELAY_MS);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return {
    scrollRef,
    isFetchingPreviousPage,
    isFetchingNextPage: isFetchingNextAfterPage,
    hasNextPage: hasNextAfterPage,
    partnerInfo,
    groupedMessages,
    failedTempIds,
    inputValue,
    setInputValue,
    handleScroll,
    handleSend,
    handleKeyDown,
  };
};
