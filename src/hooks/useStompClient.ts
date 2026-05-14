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
// 연속 5회 실패 후 잠시 대기했다가 재시도 (로그아웃 대신)
const PAUSE_AFTER_MAX_ATTEMPTS = 5 * 60_000;
// 서버가 heartbeat 미지원(heart-beat:0,0) — 주기적 강제 재연결로 NAT timeout/zombie 방지
const KEEPALIVE_INTERVAL = 5 * 60_000;

export const useStompClient = (partnerId?: string) => {
  const queryClient = useQueryClient();
  const clientRef = useRef<Client | null>(null);
  // connect 함수를 ref에 저장 — reconnectPending effect에서도 호출 가능하게
  const connectRef = useRef<(() => Promise<void>) | null>(null);
  // 재시도 횟수를 ref로 관리 — 두 effect 간 공유 및 리셋 가능
  const reconnectAttemptsRef = useRef(0);
  const isReconnectingRef = useRef(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isFirstConnectRef = useRef(true);

  const partnerIdRef = useRef(partnerId);
  useEffect(() => {
    partnerIdRef.current = partnerId;
  }, [partnerId]);

  const tabHiddenAtRef = useRef<number | null>(null);

  const setStompClient = useMessageStore((state) => state.setStompClient);
  const appendRealtimeMessage = useMessageStore((state) => state.appendRealtimeMessage);
  const clearRealtimeMessages = useMessageStore((state) => state.clearRealtimeMessages);
  const reconnectPending = useMessageStore((state) => state.reconnectPending);
  const clearReconnectPending = useMessageStore((state) => state.clearReconnectPending);

  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;
    isReconnectingRef.current = false;
    reconnectAttemptsRef.current = 0;

    const connect = async () => {
      try {
        const ottToken = await getWsToken();
        if (cancelled) return;

        const client = new Client({
          brokerURL: buildBrokerURL(ottToken),
          reconnectDelay: 0,
          heartbeatOutgoing: 4000,

          onConnect: () => {
            reconnectAttemptsRef.current = 0;
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
              const senderIdStr = String(msg.sender.id);
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
                        if (String(conv.partner.id) === senderIdStr) {
                          return {
                            ...conv,
                            lastMessage: {
                              id: msg.id,
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

              queryClient.invalidateQueries({ queryKey: ['messages', msg.sender.id] });
              queryClient.invalidateQueries({ queryKey: ['conversations'] });
            });
          },

          onWebSocketClose: async () => {
            if (cancelled || isReconnectingRef.current) return;
            isReconnectingRef.current = true;

            // 연속 실패 한도 초과 — 로그아웃 대신 일정 시간 대기 후 재시도
            if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
              reconnectAttemptsRef.current = 0;
              isReconnectingRef.current = false;
              await new Promise((resolve) => setTimeout(resolve, PAUSE_AFTER_MAX_ATTEMPTS));
              if (!cancelled) connectRef.current?.();
              return;
            }

            // 지수 백오프 대기 후 OTT 재발급 → 재연결
            const delay = getReconnectDelay(reconnectAttemptsRef.current);
            reconnectAttemptsRef.current++;

            try {
              await new Promise((resolve) => setTimeout(resolve, delay));
              if (cancelled) { isReconnectingRef.current = false; return; }
              const newToken = await getWsToken();
              if (cancelled) { isReconnectingRef.current = false; return; }
              client.configure({ brokerURL: buildBrokerURL(newToken) });
              isReconnectingRef.current = false;
              client.activate();
            } catch {
              isReconnectingRef.current = false;
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

  // 탭 포커스 복귀 시 연결 상태 확인 → 끊겨 있거나 오래 숨겨져 있었으면 재연결
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        tabHiddenAtRef.current = Date.now();
        return;
      }

      const hiddenMs = tabHiddenAtRef.current ? Date.now() - tabHiddenAtRef.current : 0;
      tabHiddenAtRef.current = null;
      reconnectAttemptsRef.current = 0;

      // 끊긴 경우, 또는 1분 이상 숨겨져 있었던 경우 재연결
      if (!clientRef.current?.connected || hiddenMs > 60_000) {
        if (clientRef.current) {
          clientRef.current.deactivate();
        } else {
          connectRef.current?.();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // 장기 탭 zombie 방지 — 서버가 heartbeat 미지원이므로 주기적 강제 재연결
  // heartbeatOutgoing(4s)이 NAT keepalive 역할을 하지만, TCP가 silently drop되는 경우 보완
  useEffect(() => {
    const id = setInterval(() => {
      if (!clientRef.current?.connected) return;
      reconnectAttemptsRef.current = 0;
      clientRef.current.deactivate();
    }, KEEPALIVE_INTERVAL);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!reconnectPending) return;
    clearReconnectPending();
    // 수동 재연결 요청 시 재시도 카운터 초기화
    reconnectAttemptsRef.current = 0;
    if (clientRef.current) {
      if (clientRef.current.connected) {
        // 연결된 상태 → deactivate → onWebSocketClose가 재연결
        clientRef.current.deactivate();
      } else if (!isReconnectingRef.current) {
        // 끊긴 상태인데 재연결 중도 아님 (5분 pause 중이거나 onWebSocketClose 미발동)
        // → 직접 새 연결 시도
        connectRef.current?.();
      }
      // isReconnectingRef.current = true면 onWebSocketClose 백오프 진행 중 → 개입 안 함
    } else {
      connectRef.current?.();
    }
  }, [reconnectPending, clearReconnectPending]);

  return clientRef.current;
};
