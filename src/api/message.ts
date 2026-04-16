import axiosInstance from './axiosInstance';

import type {
  ConversationResponse,
  CursorResponse,       
  MessageResponse,      
} from '../types/api/message';

// 대화 목록 조회
export const getConversations = async (cursor?: number, q?: string) => {
  const { data } = await axiosInstance.get<CursorResponse<ConversationResponse>>(
    '/conversations',
    { params: { ...(cursor !== undefined ? { cursor } : {}), ...(q ? { q } : {}) } },
  );
  return data;
};

// 특정 상대방과의 메시지 목록 조회
export const getMessages = async (
  partnerId: string,
  cursor?: number,
  direction: 'BEFORE' | 'AFTER' = 'BEFORE',
) => {
  const { data } = await axiosInstance.get<CursorResponse<MessageResponse>>(
    `/messages/${partnerId}`,
    { params: { ...(cursor !== undefined ? { cursor } : {}), direction } },
  );
  return data;
};

// 특정 대화방의 메시지를 읽음 처리
export const readConversation = async (partnerId: string) => {
  await axiosInstance.patch(`/conversations/${partnerId}/read`);
};

// WebSocket 연결용 일회용 토큰 발급
export const getWsToken = async (): Promise<string> => {
  const { data } = await axiosInstance.post<{ token: string }>('/auth/ws-token');
  return data.token;
};
