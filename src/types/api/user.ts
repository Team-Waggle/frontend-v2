import type { PositionType } from './posts';
import type { UserReviewTag } from './team';

export type MyApplicationResponse = {
  applicationId: number;
  position: PositionType;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  teamId: number;
  postId: number;
  detail: string;
  portfolioUrls: string[];
  createdAt: string;
  updatedAt: string;
};

export type UserMeResponse = {
  userId: string;
  username: string;
  email: string;
  temperature: number;
  profileImageUrl: string;
  position: PositionType;
  bio: string;
  skills: string[];
  portfolioUrls: string[];
  topLikeTags: {
    tag: UserReviewTag;
    count: number;
  }[];
  createdAt: string;
  updatedAt: string;
};
