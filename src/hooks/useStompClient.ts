import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { useQueryClient } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { useMessageStore } from '../stores/messageStore';
import { getWsToken } from '../api/message';
import type { ConversationResponse, CursorResponse, MessageResponse } from '../types/api/message';

// OTT(일회용 토큰)를 URL 쿼리 파라미터로 전달 — 서버가 WebSocket 업그레이드 시점에 검증
const buildBrokerURL = (ottToken: string) =>
  `${import.meta.env.VITE_WS_URL as string}?token=${ottToken}`;

const getReconnectDelay = (attempt: number) => Math.min(1000 * 2 ** attempt, 30_000);
const MAX_RECONNECT_ATTEMPTS = 5;

export const useStompClient = (partnerId?: string) => {
  const queryClient = useQueryClient();
  const clientRef = useRef<Client | null>(null);
  // connect 함수를 ref에 저장 — reconnectPending effect에서도 호출 가능하게
  const connectRef = useRef<(() => Promise<void>) | null>(null);
  // 재시도 횟수를 ref로 관리 — 두 effect 간 공유 및 리셋 가능
  const reconnectAttemptsRef = useRef(0);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isFirstConnectRef = useRef(true);

  const partnerIdRef = useRef(partnerId);
  useEffect(() => {
    partnerIdRef.current = partnerId;
  }, [partnerId]);

  const setStompClient = useMessageStore((state) => state.setStompClient);
  const appendRealtimeMessage = useMessageStore((state) => state.appendRealtimeMessage);
  const clearRealtimeMessages = useMessageStore((state) => state.clearRealtimeMessages);
  const reconnectPending = useMessageStore((state) => state.reconnectPending);
  const clearReconnectPending = useMessageStore((state) => state.clearReconnectPending);

  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;
    let isReconnecting = false;
    reconnectAttemptsRef.current = 0;

    const connect = async () => {
      try {
        const ottToken = await getWsToken();
        if (cancelled) return;

        const client = new Client({
          brokerURL: buildBrokerURL(ottToken),
          reconnectDelay: 0,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,

          onConnect: () => {
            reconnectAttemptsRef.current = 0;
            isReconnecting = false;
            setStompClient(client);

            // 연결 시 대기 중인 실패 메시지 재전송
            const { pendingRetry, clearPendingRetry, unmarkTempFailed } =
              useMessageStore.getState();
            if (pendingRetry.length > 0) {
              const toRetry = [...pendingRetry];
              clearPendingRetry();
              toRetry.forEach(({ receiverId, content, tempId }) => {
                unmarkTempFailed(tempId);
                client.publish({
                  destination: '/app/message/send',
                  body: JSON.stringify({ receiverId, content }),
                });
                setTimeout(() => {
                  queryClient.invalidateQueries({ queryKey: ['messages', receiverId] });
                }, 800);
              });
            }

            // 재연결 시 끊긴 동안 놓친 메시지 동기화
            if (!isFirstConnectRef.current) {
              queryClient.invalidateQueries({ queryKey: ['conversations'] });
              const currentPartnerId = partnerIdRef.current;
              if (currentPartnerId) {
                queryClient.invalidateQueries({ queryKey: ['messages', currentPartnerId] });
              }
            }
            isFirstConnectRef.current = false;

            client.subscribe('/user/queue/messages', (frame) => {
              let msg: MessageResponse;
              try {
                msg = JSON.parse(frame.body) as MessageResponse;
              } catch (e) {
                console.error('STOMP 메시지 파싱 실패:', e);
                return;
              }

              const currentPartnerId = partnerIdRef.current;
              const senderIdStr = String(msg.sender.userId);
              const currentPartnerIdStr = currentPartnerId ? String(currentPartnerId) : null;

              // 현재 열린 채팅 상대의 메시지만 realtimeMessages에 추가
              if (currentPartnerIdStr && senderIdStr === currentPartnerIdStr) {
                appendRealtimeMessage(msg);
              }

              // 대화 목록 낙관적 업데이트
              queryClient.setQueryData<InfiniteData<CursorResponse<ConversationResponse>>>(
                ['conversations', undefined],
                (old) => {
                  if (!old) return old;
                  return {
                    ...old,
                    pages: old.pages.map((page) => ({
                      ...page,
                      data: page.data.map((conv) => {
                        if (String(conv.partner.userId) === senderIdStr) {
                          return {
                            ...conv,
                            lastMessage: {
                              messageId: msg.messageId,
                              content: msg.content,
                              createdAt: msg.createdAt,
                            },
                            unreadCount:
                              currentPartnerIdStr === senderIdStr
                                ? conv.unreadCount
                                : conv.unreadCount + 1,
                          };
                        }
                        return conv;
                      }),
                    })),
                  };
                },
              );

              queryClient.invalidateQueries({ queryKey: ['messages', msg.sender.userId] });
              queryClient.invalidateQueries({ queryKey: ['conversations'] });
            });
          },

          onWebSocketClose: async () => {
            if (cancelled || isReconnecting) return;
            isReconnecting = true;

            // 최대 재시도 초과 시 로그아웃 처리 (서버 장기 다운 등)
            if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
              console.error('WebSocket 재연결 한도 초과 — 로그아웃 처리');
              isReconnecting = false;
              useAuthStore.getState().logout();
              window.location.replace('/login');
              return;
            }

            // 지수 백오프 대기 후 OTT 재발급 → 재연결
            const delay = getReconnectDelay(reconnectAttemptsRef.current);
            reconnectAttemptsRef.current++;

            try {
              await new Promise((resolve) => setTimeout(resolve, delay));
              if (cancelled) { isReconnecting = false; return; }
              const newToken = await getWsToken();
              if (cancelled) { isReconnecting = false; return; }
              client.configure({ brokerURL: buildBrokerURL(newToken) });
              client.activate();
            } catch {
              isReconnecting = false;
              useAuthStore.getState().logout();
              window.location.replace('/login');
            }
          },

          onStompError: (frame) => {
            console.error('STOMP error:', frame.headers['message']);
          },

          onDisconnect: () => {
            setStompClient(null);
          },
        });

        clientRef.current = client;
        client.activate();
      } catch {
        if (cancelled) return;
        if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
          console.warn('WebSocket 토큰 발급 한도 초과 — 연결 중단');
          return;
        }
        const delay = getReconnectDelay(reconnectAttemptsRef.current);
        reconnectAttemptsRef.current++;
        await new Promise((resolve) => setTimeout(resolve, delay));
        if (cancelled) return;
        connect();
      }
    };

    connectRef.current = connect;
    connect();

    return () => {
      cancelled = true;
      isFirstConnectRef.current = true;
      clientRef.current?.deactivate();
      clientRef.current = null;
      setStompClient(null);
    };
  }, [accessToken]);

  useEffect(() => {
    if (partnerId) {
      clearRealtimeMessages();
    }
  }, [partnerId, clearRealtimeMessages]);

  // 탭 포커스 복귀 시 연결 상태 확인 → 끊겨 있으면 재연결
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;
      if (clientRef.current?.connected) return;
      reconnectAttemptsRef.current = 0;
      if (clientRef.current) {
        // 기존 클라이언트 deactivate → onWebSocketClose가 재연결 처리
        clientRef.current.deactivate();
      } else {
        connectRef.current?.();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (!reconnectPending) return;
    clearReconnectPending();
    // 수동 재연결 요청 시 재시도 카운터 초기화
    reconnectAttemptsRef.current = 0;
    if (clientRef.current) {
      // 클라이언트가 있으면 deactivate → onWebSocketClose가 재연결 처리
      clientRef.current.deactivate();
    } else {
      // 클라이언트가 없으면 (OTT 실패 or 아직 연결 중) connect 직접 재시도
      connectRef.current?.();
    }
  }, [reconnectPending, clearReconnectPending]);

  return clientRef.current;
};
