// Base URL 설정
export const BASE_URL = import.meta.env.VITE_BASE_URL;

// 모집글 API
export const POST_URL = '/posts'; // 모집글 목록 페이지네이션 조회, 모집글 생성
export const POST_DETAIL_URL = (postId: number) => `/posts/${postId}`; // 모집글 상세 조회, 수정, 삭제

// 북마크 API
export const BOOKMARK_URL = '/bookmarks'; // 북마크 토글(ON/OFF)

// 사용자 API
export const USERS_URL = (userId: string) => `/users/${userId}`; // 사용자 정보 조회
export const USERS_FOLLOW_COUNT_URL = (userId: string) =>
  `/users/${userId}/follow-count`; // 사용자 팔로우 개수 정보 조회
export const USERS_PROJECTS_URL = (userId: string) =>
  `/users/${userId}/projects`; // 사용자 참여 프로젝트 목록 조회
export const USERS_CHECK_URL = '/users/check'; //사용자명 사용 가능 여부 조회
export const USERS_ME_URL = '/users/me'; // 본인 프로필 수정
export const USERS_ME_APPLICATIONS_URL = '/users/me/applications'; // 본인 지원 목록 조회
export const USERS_ME_BOOKMARKS_URL = '/users/me/bookmarks'; // 본인 북마크 목록 조회
export const USERS_ME_FOLLOWEES_URL = '/users/me/followees'; // 본인이 팔로우 하는 계정 목록 조회
export const USERS_ME_FOLLOWERS_URL = '/users/me/followers'; // 본인을 팔로우 하는 계정 목록 조회
export const USERS_ME_NOTIFICATIONS_URL = '/users/me/notifications'; // 본인 알림 목록 조회
export const USERS_ME_PROFILE_URL = '/users/me/profile'; // 사용자 프로필 초기 설정
export const USERS_ME_PROFILE_COMPLETION_URL = '/users/me/profile-completion'; // 프로필 완성 여부 조회
export const USERS_ME_PROJECTS_URL = '/users/me/projects'; // 본인 참여 프로젝트 목록 조회

// 인증 토큰
export const LOGOUT_URL = '/auth/logout'; // 로그아웃
export const REFRESH_TOKEN_URL = '/auth/refresh'; // 액세스 토큰 재발급

// 프로젝트
export const PROJECTS_URL = '/projects'; // 프로젝트 생성
export const PROJECTS_DETAIL_URL = (projectId: number) =>
  `/projects/${projectId}`; // 프로젝트 상세 조회, 수정, 삭제
export const PROJECTS_APPLICATION_URL = (projectId: number) =>
  `/projects/${projectId}/applications`; // 프로젝트 지원 목록 조회, 지원
export const PROJECTS_MEMBERS_URL = (projectId: number) =>
  `/projects/${projectId}/members`; // 프로젝트 이탈
export const PROJECTS_RECRUITMENTS_URL = (projectId: number) =>
  `/projects/${projectId}/recruitments`; // 프로젝트 모집 정보 생성

// 프로젝트 멤버
export const MEMBER_URL = (memberId: number) => `/members/${memberId}`; // 멤버 추방, 멤버 역할 변경

// 프로젝트 지원
export const APPLICATION_DELETE_URL = (applicationId: number) =>
  `/applications${applicationId}`; // 프로젝트 지원 삭제
export const APPLICATION_APPROVE_URL = (applicationId: number) =>
  `/applications${applicationId}/approve`; // 프로젝트 지원 승인
export const APPLICATION_REJECT_URL = (applicationId: number) =>
  `/applications${applicationId}/reject`; //프로젝트 지원 거절
