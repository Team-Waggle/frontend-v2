import type { PositionType } from './posts';

export type TeamResponse = {
  id: number;
  name: string;
  description: string;
  status: 'PREPARING' | 'ACTIVE' | 'COMPLETED';
  workMode: 'ONLINE' | 'OFFLINE';
  profileImageUrl: string;
  memberCount: number;
  position: string;
  role: 'LEADER' | 'MANAGER' | 'MEMBER';
  visible: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type MemberResponse = {
  id: number;
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
  id: number;
  position: PositionType;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  teamId: number;
  postId: number;
  user: {
    id: string;
    username: string;
    temperature: number;
    profileImageUrl: string;
  };
  read: boolean;
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
  | 'APPLICATION_REJECTED'
  | 'APPLICATION_REMIND'
  | 'TEAM_JOINED'
  | 'MEMBER_JOINED'
  | 'MEMBER_LEFT'
  | 'MEMBER_REMOVED'
  | 'REVIEW_REQUESTED'
  | 'REVIEW_RECEIVED';

export type NotificationResponse = {
  id: number;
  type: NotificationType;
  metadata: {
    post: {
      id: number;
      title: string;
    };
    team: {
      id: number;
      name: string;
      profileImageUrl: string;
    };
    triggeredBy: {
      id: string;
      username: string;
    };
    position: PositionType;
    unreadApplicationCount: number;
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

export type UserReviewTag =
  | 'PUNCTUAL'
  | 'SKILLED'
  | 'GOOD_COMMUNICATOR'
  | 'RESPONSIBLE'
  | 'KIND'
  | 'PICASSO'
  | 'PROMOTER'
  | 'GOAT'
  | 'LEGEND'
  | 'METICULOUS'
  | 'LATE'
  | 'NO_SHOW'
  | 'SENSITIVE'
  | 'UNKIND'
  | 'DESERTER';

export type ReviewRequestType = {
  type: 'LIKE' | 'DISLIKE';
  tags: UserReviewTag[];
};
