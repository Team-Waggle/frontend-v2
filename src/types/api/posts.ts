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
  | 'MARKETER';

export type PostUser = {
  userId: string;
  username: string;
  email: string;
  profileImageUrl: string;
  position: PositionType;
  createdAt?: string;
  updatedAt?: string;
};

export type RecruitmentStatusType = 'RECRUITING' | 'CLOSED';

export type RecruitmentResponse = {
  recruitmentId: number;
  position: PositionType;
  recruitingCount: number;
  status: RecruitmentStatusType;
  skills?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type PostDetailResponse = {
  postId: number;
  title: string;
  content: string;
  user: PostUser;
  isRecruiting: boolean;
  recruitments: RecruitmentResponse[];
  applicantCount: number;
  createdAt?: string;
  updatedAt?: string;
};

export type GetPostsParams = {
  page: number;
  size: number;
  sort?: string[];
  q?: string;
};

export type GetPostsResponse = PageResponse<PostDetailResponse>;

export type GetPostDetailResponse = PostDetailResponse;
