import { create } from 'zustand';
import type { Client } from '@stomp/stompjs';
import type { MessageResponse } from '../types/api/message';

export const TEMP_ID_BASE = 9_000_000_000_000; // 임시 ID 범위 (서버 DB ID와 충돌 없음)
const MAX_REALTIME_MESSAGES = 200; // 메모리 누수 방지를 위한 realtime 메시지 최대 보관 수

interface PendingRetry {
  receiverId: string;
  content: string;
  tempId: number;
}

interface MessageStore {
  stompClient: Client | null;
  realtimeMessages: MessageResponse[];
  failedTempIds: number[];
  pendingRetry: PendingRetry[];
  reconnectPending: boolean;

  setStompClient: (client: Client | null) => void;
  appendRealtimeMessage: (msg: MessageResponse) => void;
  clearRealtimeMessages: () => void;
  clearTempMessages: () => void;
  removeFailedTemps: () => void;
  markTempFailed: (tempId: number) => void;
  unmarkTempFailed: (tempId: number) => void;
  queueRetry: (receiverId: string, content: string, tempId: number) => void;
  clearPendingRetry: () => void;
  requestReconnect: () => void;
  clearReconnectPending: () => void;
  publish: (receiverId: string, content: string) => boolean;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
  stompClient: null,
  realtimeMessages: [],
  failedTempIds: [],
  pendingRetry: [],
  reconnectPending: false,

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
      realtimeMessages: state.realtimeMessages.filter((m) => m.id < TEMP_ID_BASE),
      failedTempIds: [],
    })),

  removeFailedTemps: () =>
    set((state) => {
      const failed = new Set(state.failedTempIds);
      return {
        realtimeMessages: state.realtimeMessages.filter((m) => !failed.has(m.id)),
        failedTempIds: [],
      };
    }),

  markTempFailed: (tempId) =>
    set((state) => ({
      failedTempIds: state.failedTempIds.includes(tempId)
        ? state.failedTempIds
        : [...state.failedTempIds, tempId],
    })),

  unmarkTempFailed: (tempId) =>
    set((state) => ({
      failedTempIds: state.failedTempIds.filter((id) => id !== tempId),
    })),

  queueRetry: (receiverId, content, tempId) =>
    set((state) => ({
      pendingRetry: [...state.pendingRetry, { receiverId, content, tempId }],
    })),

  clearPendingRetry: () => set({ pendingRetry: [] }),

  requestReconnect: () => set({ reconnectPending: true }),
  clearReconnectPending: () => set({ reconnectPending: false }),

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
