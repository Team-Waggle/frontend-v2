// Base URL 설정
export const BASE_URL = import.meta.env.VITE_BASE_URL;

// 모집글 API
export const POST_URL = '/posts'; // 모집글 목록 페이지네이션 조회, 모집글 생성
export const POST_DETAIL_URL = (postId: number) => `/posts/${postId}`; // 모집글 상세 조회, 수정, 삭제
export const POST_CLOSE_URL = (postId: number) => `/posts/${postId}/close`;

// 북마크 API
export const BOOKMARK_URL = '/bookmarks'; // 북마크 토글(ON/OFF)

// 사용자 API
export const USERS_URL = (userId: string) => `/users/${userId}`; // 사용자 조회
export const USERS_FOLLOW_COUNT_URL = (userId: string) =>
  `/users/${userId}/follow-count`; // 사용자 팔로우 개수 정보 조회
export const USERS_TEAMS_URL = (userId: string) => `/users/${userId}/teams`; // 사용자 참여 팀 목록 조회
export const USERS_CHECK_URL = '/users/check'; //사용자명 사용 가능 여부 조회
export const USERS_ME_URL = '/users/me'; // 본인 프로필 수정
export const USERS_ME_APPLICATIONS_URL = '/users/me/applications'; // 본인 지원 목록 조회
export const USERS_ME_BOOKMARKS_URL = '/users/me/bookmarks'; // 본인 북마크 목록 조회
export const USERS_ME_FOLLOWEES_URL = '/users/me/followees'; // 본인이 팔로우 하는 계정 목록 조회
export const USERS_ME_FOLLOWERS_URL = '/users/me/followers'; // 본인을 팔로우 하는 계정 목록 조회
export const USERS_ME_NOTIFICATIONS_URL = '/users/me/notifications'; // 본인 알림 목록 조회
export const USERS_ME_PROFILE_URL = '/users/me/profile'; // 사용자 프로필 초기 설정
export const USERS_ME_PROFILE_COMPLETION_URL = '/users/me/profile-completion'; // 프로필 완성 여부 조회
export const USERS_ME_PRESIGNED_URL = '/users/me/profile-image/presigned-url'; // 사용자 프로필 이미지 업로드용 Presigned URL 생성
export const USERS_ME_TEAMS_URL = '/users/me/teams'; //본인 참여 팀 목록 조회

// 인증 토큰 API
export const LOGOUT_URL = '/auth/logout'; // 로그아웃
export const REFRESH_TOKEN_URL = '/auth/refresh'; // 액세스 토큰 재발급

// 프로젝트 API
export const TEAMS_URL = '/teams'; // 팀 생성
export const TEAMS_DETAIL_URL = (teamId: number) => `/teams/${teamId}`; // 팀 상세 조회, 수정, 삭제
export const TEAMS_APPLICATION_URL = (teamId: number) =>
  `/teams/${teamId}/applications`; // 팀 지원 목록 조회, 지원
export const TEAMS_MEMBERS_URL = (teamId: number) => `/teams/${teamId}/members`; // 팀 이탈
export const TEAMS_RECRUITMENTS_URL = (teamId: number) =>
  `/teams/${teamId}/posts`; // 팀 모집글 목록 조회
export const TEAMS_PRESIGNED_URL = '/teams/profile-image/presigned-url'; // 팀 프로필 이미지 업로드용 Presigned URL 생성

// 팀 멤버 API
export const MEMBER_URL = (memberId: number) => `/members/${memberId}`; // 멤버 추방, 멤버 역할 변경

// 팀 지원 API
export const APPLICATION_DELETE_URL = (applicationId: number) =>
  `/applications${applicationId}`; // 팀 지원 삭제
export const APPLICATION_APPROVE_URL = (applicationId: number) =>
  `/applications${applicationId}/approve`; // 팀 지원 승인
export const APPLICATION_REJECT_URL = (applicationId: number) =>
  `/applications${applicationId}/reject`; //팀 지원 거절
