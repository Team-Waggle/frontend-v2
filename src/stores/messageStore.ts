import { create } from 'zustand';
import type { Client } from '@stomp/stompjs';
import type { MessageResponse } from '../types/api/message';

export const TEMP_ID_BASE = 9_000_000_000_000; // 임시 ID 범위 (서버 DB ID와 충돌 없음)
const MAX_REALTIME_MESSAGES = 200; // 메모리 누수 방지를 위한 realtime 메시지 최대 보관 수

interface MessageStore {
  stompClient: Client | null;
  realtimeMessages: MessageResponse[];
  failedTempIds: number[];

  setStompClient: (client: Client | null) => void;
  appendRealtimeMessage: (msg: MessageResponse) => void;
  clearRealtimeMessages: () => void;
  clearTempMessages: () => void;
  markTempFailed: (tempId: number) => void;
  publish: (receiverId: string, content: string) => boolean;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
  stompClient: null,
  realtimeMessages: [],
  failedTempIds: [],

  setStompClient: (client) => set({ stompClient: client }),

  appendRealtimeMessage: (msg) =>
    set((state) => {
      const messages = [...state.realtimeMessages, msg];
      // 오래된 메시지를 앞에서 잘라내 메모리 무한 증가 방지
      if (messages.length > MAX_REALTIME_MESSAGES) {
        messages.splice(0, messages.length - MAX_REALTIME_MESSAGES);
      }
      return { realtimeMessages: messages };
    }),

  clearRealtimeMessages: () => set({ realtimeMessages: [], failedTempIds: [] }),

  clearTempMessages: () =>
    set((state) => ({
      realtimeMessages: state.realtimeMessages.filter((m) => m.messageId < TEMP_ID_BASE),
      failedTempIds: [],
    })),

  markTempFailed: (tempId) =>
    set((state) => ({
      failedTempIds: state.failedTempIds.includes(tempId)
        ? state.failedTempIds
        : [...state.failedTempIds, tempId],
    })),

  // 전송 성공 여부를 반환 — false면 호출부에서 임시 메시지를 failed로 표시
  publish: (receiverId, content) => {
    const { stompClient } = get();
    if (!stompClient?.connected) {
      console.warn('STOMP not connected');
      return false;
    }
    stompClient.publish({
      destination: '/app/message/send',
      body: JSON.stringify({ receiverId, content }),
    });
    return true;
  },
}));
