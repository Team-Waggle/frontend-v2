import type { PositionType } from './posts';

export type TeamResponse = {
  teamId: number;
  name: string;
  description: string;
  status: 'PREPARING' | 'ACTIVE' | 'COMPLETED';
  workMode: 'ONLINE' | 'OFFLINE';
  profileImageUrl: string;
  memberCount: number;
  position: string;
  role: 'LEADER' | 'MANAGER' | 'MEMBER';
  isVisible: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type MemberResponse = {
  memberId: number;
  teamId: number;
  userId: number;
  role: 'LEADER' | 'MANAGER' | 'MEMBER';
  position: string;
  username: string;
  profileImageUrl: string;
  skills: string[];
  createAt: string;
  updateAt: string;
  deletedAt: string | null;
};

export type ApplicantResponse = {
  applicationId: number;
  position: PositionType;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  teamId: number;
  postId: number;
  user: {
    userId: string;
    username: string;
    temperature: number;
    profileImageUrl: string;
  };
  isRead: boolean;
  detail: string;
  portfolioUrls: string[];
  createdAt: string;
  updatedAt: string;
};

export type CursorResponseApplicantResponse = {
  data: ApplicantResponse[];
  nextCursor: number | null;
  hasNext: boolean;
};

export type NotificationType =
  | 'APPLICATION_RECEIVED'
  | 'APPLICATION_ACCEPTED'
  | 'APPLICATION_REJECTED'
  | 'APPLICATION_REMIND'
  | 'MEMBER_JOINED'
  | 'MEMBER_LEFT'
  | 'MEMBER_REMOVED'
  | 'REVIEW_REQUESTED'
  | 'REVIEW_RECEIVED';

export type NotificationResponse = {
  notificationId: number;
  type: NotificationType;
  team: {
    teamId: number;
    name: string;
    profileImageUrl: string;
  };
  triggeredBy: {
    userId: string;
    username: string;
  };
  readAt?: string;
  createdAt: string;
};

export type CursorNotificationResponse = {
  data: NotificationResponse[];
  nextCursor: number | null;
  hasNext: boolean;
};

export type GetApplicationsParams = {
  teamId: number;
  postId?: number;
  cursor?: number;
  size?: number;
  direction?: 'BEFORE' | 'AFTER';
};
