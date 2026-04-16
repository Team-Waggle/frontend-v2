export interface MessagePartnerResponse {
  userId: string;
  username: string | null;
  profileImageUrl: string | null;
  position: string;
}

export interface MessageResponse {
  messageId: number;
  sender: MessagePartnerResponse;
  receiver: MessagePartnerResponse;
  content: string;
  createdAt: string;
  readAt: string | null;
}

export interface LastMessage {
  messageId: number;
  content: string;
  createdAt: string;
}

export interface ConversationResponse {
  partner: MessagePartnerResponse;
  unreadCount: number;
  lastReadMessageId: number | null;
  lastMessage: LastMessage;
}

export interface CursorResponse<T> {
  data: T[];
  nextCursor: number | null;
  hasNext: boolean;
}

// 낙관적 업데이트용 임시 메시지 타입
export interface OptimisticMessage {
  tempId: string;
  content: string;
  createdAt: string;
  status: 'sending' | 'sent' | 'failed';
}
