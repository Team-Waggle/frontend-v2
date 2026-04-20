import type { PositionType } from './posts';

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
