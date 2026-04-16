import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router';

import { useGetConversations, useGetMessages, useGetMessagesAfter, useReadConversation } from './useMessage';
import { useGetUserMe } from './useUser';
import { TEMP_ID_BASE, useMessageStore } from '../stores/messageStore';
import type { MessageResponse } from '../types/api/message';
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
 * ChatArea와 ModalChatView의 공통 채팅 로직을 담당하는 훅.
 * @param partnerId 대화 상대 userId
 * @param highlight 검색에서 이동한 경우 하이라이트할 messageId
 */
export const useChatLogic = (partnerId: string, highlight?: string | null) => {
  const queryClient = useQueryClient();
  const { data: me } = useGetUserMe();
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
  const isAtBottomRef = useRef(true);

  const [inputValue, setInputValue] = useState('');

  const { realtimeMessages, failedTempIds, appendRealtimeMessage, markTempFailed, publish } =
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

  // historyData 또는 afterData 갱신 시 임시 메시지 제거 — 서버 데이터로 대체됨
  useEffect(() => {
    if (historyMessages.length === 0 && afterMessages.length === 0) return;
    const hasTempMessages = useMessageStore
      .getState()
      .realtimeMessages.some((m) => m.messageId >= TEMP_ID_BASE);
    if (hasTempMessages) useMessageStore.getState().clearTempMessages();
  }, [historyMessages, afterMessages]);

  // messageId 기준 deduplication + 현재 파트너 메시지만 포함
  const allMessages: MessageResponse[] = useMemo(() => {
    const map = new Map<number, MessageResponse>();
    const partnerIdStr = String(partnerId);
    const relevantRealtime = realtimeMessages.filter(
      (m) =>
        String(m.sender.userId) === partnerIdStr ||
        String(m.receiver.userId) === partnerIdStr,
    );
    const realtimeToInclude = hasNextAfterPage
      ? relevantRealtime.filter((m) => m.messageId >= TEMP_ID_BASE)
      : relevantRealtime;
    [...historyMessages, ...afterMessages, ...realtimeToInclude].forEach((m) =>
      map.set(m.messageId, m),
    );
    return [...map.values()].sort((a, b) => a.messageId - b.messageId);
  }, [historyMessages, afterMessages, realtimeMessages, partnerId, hasNextAfterPage]);

  // 파트너 정보
  const partnerInfo = useMemo(() => {
    const fromConversations = conversationsData?.pages
      .flatMap((p) => p.data)
      .find((c) => c.partner.userId === partnerId)?.partner;
    if (fromConversations) return fromConversations;
    const fromMessages =
      allMessages.find((m) => m.sender.userId === partnerId)?.sender ??
      allMessages.find((m) => m.receiver.userId === partnerId)?.receiver ??
      null;
    if (fromMessages) return fromMessages;
    if (locationState?.username) {
      return {
        userId: partnerId,
        username: locationState.username,
        position: locationState.position ?? null,
        profileImageUrl: locationState.profileImageUrl ?? null,
      };
    }
    return null;
  }, [conversationsData, allMessages, partnerId, locationState]);

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
        const isMine = msg.sender.userId === me?.userId;
        const time = formatKstHhMm(msg.createdAt);
        const isTemp = msg.messageId >= TEMP_ID_BASE;
        const last = bubbleGroups[bubbleGroups.length - 1];
        if (last && last.isMine === isMine && last.time === time) {
          last.contents.push(msg.content);
          last.messageIds.push(msg.messageId);
          if (isTemp) last.isTemp = true;
        } else {
          bubbleGroups.push({
            isMine,
            contents: [msg.content],
            time,
            profileImageUrl: msg.sender.profileImageUrl,
            key: msg.messageId,
            messageIds: [msg.messageId],
            isTemp,
          });
        }
      });
      return { date, bubbleGroups };
    });
  }, [allMessages, me?.userId]);

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

  // 과거 메시지 로드 후 스크롤 위치 보존
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || prevScrollHeightRef.current === 0) return;
    const diff = el.scrollHeight - prevScrollHeightRef.current;
    el.scrollTop += diff;
    prevScrollHeightRef.current = 0;
  }, [historyData]);

  const lastMessageId = allMessages[allMessages.length - 1]?.messageId;

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

  const handleSend = () => {
    const content = inputValue.trim();
    if (!content) return;

    const tempId = TEMP_ID_BASE + (++tempIdCounterRef.current);

    // 전송 즉시 임시 메시지로 화면에 표시
    if (me) {
      appendRealtimeMessage({
        messageId: tempId,
        sender: {
          userId: me.userId,
          username: me.username,
          profileImageUrl: me.profileImageUrl,
          position: me.position,
        },
        receiver: { userId: partnerId, username: null, profileImageUrl: null, position: '' },
        content,
        createdAt: new Date().toISOString(),
        readAt: null,
      });
    }

    const sent = publish(partnerId, content);
    if (!sent) {
      markTempFailed(tempId);
      return;
    }

    setInputValue('');
    prevScrollHeightRef.current = 0;

    // 서버 저장 완료 후 히스토리 갱신
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['messages', partnerId] });
    }, HISTORY_REFETCH_DELAY_MS);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
