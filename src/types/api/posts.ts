import type { TeamResponse } from './team';

export type SortObject = {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
};

export type PageableInfo = {
  offset: number;
  sort: SortObject;
  paged: boolean;
  pageSize: number;
  pageNumber: number;
  unpaged: boolean;
};

export type PageResponse<T> = {
  totalPages: number;
  totalElements: number;
  size: number;
  content: T[];
  number: number;
  sort: SortObject;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: PageableInfo;
  empty: boolean;
};

export type PositionType =
  | 'FRONTEND'
  | 'BACKEND'
  | 'DESIGNER'
  | 'IOS'
  | 'ANDROID'
  | 'DEVOPS'
  | 'PLANNER'
  | 'MARKETER'
  | 'OTHER';

export type PostUser = {
  userId: string;
  username: string;
  email: string;
  temperature: number;
  profileImageUrl: string;
  position: PositionType;
  skills: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type RecruitmentStatusType = 'RECRUITING' | 'CLOSED';

export type RecruitmentResponse = {
  recruitmentId: number;
  position: PositionType;
  count: number;
  status: RecruitmentStatusType;
  skills?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type PostDetailResponse = {
  postId: number;
  title: string;
  content: string;
  team: TeamResponse;
  user: PostUser;
  isRecruiting: boolean;
  recruitments: RecruitmentResponse[];
  applicantCount: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CursorResponsePostDetailResponse = {
  data: PostDetailResponse[];
  nextCursor: number | null;
  hasNext: boolean;
};

export type PostsSort = 'NEWEST' | 'OLDEST';

export type GetPostsParams = {
  q?: string;
  positions?: string[];
  skills?: string[];
  cursor?: number;
  size?: number;
  sort?: PostsSort;
};

export type ApplyRequest = {
  postId: number;
  position: string;
  detail: string;
  portfolioUrls: string[];
};

export type GetPostsResponse = PageResponse<PostDetailResponse>;

export type GetPostDetailResponse = PostDetailResponse;

export type GetTeamPostsResponse = PostDetailResponse[];
