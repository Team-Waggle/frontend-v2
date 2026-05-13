import type { PositionType } from './posts';
import type { UserReviewTag } from './team';

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type MyApplicationItem = {
  id: number;
  position: PositionType;
  status: ApplicationStatus;
  detail: string;
  portfolioUrls: string[];
  team: {
    id: number;
    name: string;
    description: string;
    status: string;
    workMode: string;
    profileImageUrl: string | null;
    memberCount: number;
    memberRole: string;
    createdAt: string;
    updatedAt: string;
  };
  post: {
    id: number;
    title: string;
  };
  createdAt: string;
};

export type MyApplicationsResponse = {
  data: MyApplicationItem[];
  nextCursor: number | null;
  hasNext: boolean;
};

export type MyApplicationResponse = MyApplicationItem;

export type ApplicationStatusLabel = '검토중' | '합류확정' | '불합격';
export type ApplicationStat = '전체' | '검토중' | '합류확정' | '불합격';

export type UserMeResponse = {
  id: string;
  username: string;
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
