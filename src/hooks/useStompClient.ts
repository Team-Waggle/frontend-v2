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
  const accessToken = useAuthStore((state) => state.accessToken);
  const isFirstConnectRef = useRef(true);

  const partnerIdRef = useRef(partnerId);
  useEffect(() => {
    partnerIdRef.current = partnerId;
  }, [partnerId]);

  const setStompClient = useMessageStore((state) => state.setStompClient);
  const appendRealtimeMessage = useMessageStore((state) => state.appendRealtimeMessage);
  const clearRealtimeMessages = useMessageStore((state) => state.clearRealtimeMessages);

  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;
    let reconnectAttempts = 0;

    const connect = async () => {
      try {
        const ottToken = await getWsToken();
        if (cancelled) return;

        const client = new Client({
          brokerURL: buildBrokerURL(ottToken),
          reconnectDelay: 0,
          heartbeatIncoming: 10000,
          heartbeatOutgoing: 10000,

          onConnect: () => {
            reconnectAttempts = 0;
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
            if (cancelled) return;

            // 최대 재시도 초과 시 로그아웃 처리 (서버 장기 다운 등)
            if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
              console.error('WebSocket 재연결 한도 초과 — 로그아웃 처리');
              useAuthStore.getState().logout();
              window.location.replace('/login');
              return;
            }

            // 지수 백오프 대기 후 OTT 재발급 → 재연결
            const delay = getReconnectDelay(reconnectAttempts);
            reconnectAttempts++;

            try {
              await new Promise((resolve) => setTimeout(resolve, delay));
              if (cancelled) return;
              const newToken = await getWsToken();
              if (cancelled) return;
              client.configure({ brokerURL: buildBrokerURL(newToken) });
              client.activate();
            } catch {
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
        console.error('WebSocket 토큰 발급 실패');
      }
    };

    connect();

    return () => {
      cancelled = true;
      isFirstConnectRef.current = true;
      clientRef.current?.deactivate();
      setStompClient(null);
    };
  }, [accessToken]);

  useEffect(() => {
    if (partnerId) {
      clearRealtimeMessages();
    }
  }, [partnerId, clearRealtimeMessages]);

  return clientRef.current;
};
