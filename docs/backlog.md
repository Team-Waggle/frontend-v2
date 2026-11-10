# 프론트엔드 개선 백로그

기존 코드와 설정에서 개선이 필요한 항목을 우선순위별로 정리한 문서다. 신규 기능은 다루지 않는다.

- 기준 커밋: `dee2918` (`main`, PR #269 머지 시점)
- 항목마다 **확인** 칸에 검증 수준을 적었다
  - 실행 확인: 빌드, lint, 의존성 감사 등을 실제로 돌려 결과를 본 것
  - 코드 추적: 호출 경로를 끝까지 따라가 확인했지만 브라우저에서 재현하지는 않은 것
  - 추정: 서버 동작이나 실기기 환경에 따라 달라져 코드만으로 확정할 수 없는 것
- 우선순위는 서비스 흐름의 중요도와 영향 범위로 정했다. 흐름의 중요도는 API 서버 코드에서 확인한 서비스 구조를 기준으로 했다
  1. 지원 흐름: 모집글 탐색 → 상세 → 로그인과 온보딩 → 지원 → 매니저의 지원서 검토와 승인 → 팀 합류. 서비스가 존재하는 이유다. 서버도 처리되지 않은 지원서를 2~3일 뒤 매니저에게 다시 알려 이 흐름을 밀어 준다
  2. 팀 운영과 신뢰 지표: 팀 상태(준비 → 진행 → 완료), 완료 시 리뷰 요청, 리뷰로 계산되는 협업 온도. 협업 온도는 다른 사람이 팀원을 고를 때 보는 지표다
  3. 소통 경로: 알림(지원서 도착, 지원 결과), 메시지
  4. 참여 기능: 좋아요, 북마크, 댓글, 조회수, 공유
- 등급 기준과 ID 형식(`우선순위-번호`)
  - P0: 지원 흐름이 지금 끊기거나, 개인정보가 남거나 노출되는 문제. 다른 작업보다 먼저 처리
  - P1: 1~3번 흐름의 결함, 또는 모든 화면에 영향을 주는 결함. 이번 작업 주기 안에 처리
  - P2: 특정 조건에서만 생기는 결함, 접근성, 개발 환경과 배포
  - P3: 참여 기능의 결함, 코드 구조와 정리, 참고 사항
- 항목마다 **백엔드** 칸에 API 서버(WaggleAPIServer)와 관련이 있는지 적었다
  - 불필요: 웹만 고치면 됨
  - `-`: 서버와 관계없는 확인 작업 (P3-18)
- 서버와 API 계약이나 배포 순서를 맞춰야 하는 항목은 [서버와 함께 처리할 백로그](backlog-with-backend.md)에 따로 모았다. 이 문서에는 웹만으로 고칠 수 있는 부분만 남겼다
- SEO는 [SEO 전략 검토 v2](SEO-전략-검토-v2.md)에서 따로 다루므로 이 문서에는 넣지 않았다. 운영 환경의 봇 프리렌더는 그 문서 9.2절에서 정상으로 확인됐다
- 항목을 처리하면 그 PR에서 이 문서의 해당 항목을 지울 것

## 총평

기능 범위에 비해 구현 속도는 빠르지만, 그 속도를 받쳐 줄 안전장치가 거의 없다. 정리하면 다음과 같다.

- **품질 게이트가 없다.** 테스트 파일이 하나도 없다. PR에서 빌드, lint, 타입 검사를 돌리지 않고, `main`에 푸시된 뒤 배포 빌드에서야 타입 오류가 드러난다. PR 단계의 자동 검증은 Gemini 리뷰 코멘트뿐이다.
- **공통 계층이 비어 있어서 같은 결함이 화면마다 반복된다.** 다이얼로그, 확인 모달, 쿼리 키, 에러 화면, 제출 중 상태 처리가 공통화되어 있지 않다. 중복 제출, 포커스 관리 누락, 에러를 빈 목록으로 보여 주는 문제가 거의 모든 폼과 목록에서 같은 모양으로 나온다. 하나씩 고치기보다 공통 부품을 먼저 만드는 편이 싸다.
- **서버 상태 관리가 정교하지만 경계가 없다.** 낙관적 업데이트, 재연결, 캐시 복구 같은 어려운 부분에 공을 들였다. 반면 무엇을 저장하고 언제 지우는지에 대한 경계가 없다. DM을 포함한 전체 캐시가 24시간 동안 localStorage에 남는다(P0-3). 에러 바운더리는 의도대로 동작하지 않는다(P1-1).
- **서버 계약을 코드로 확인하지 않고 가정한다.** 서버가 이미 주는 것을 쓰지 않거나, 서버와 다른 규칙을 따로 둔다. 서버는 메시지 실패를 오류 채널로 보내는데 웹은 구독하지 않는다(P1-4). 미읽음 지원자 수도 서버가 주는데, 웹은 지원자를 모두 불러와 센다(P0-2). 서버는 탈퇴자의 `triggeredBy`를 빼고 보내는데, 웹은 항상 있다고 가정한다(P0-1). 닉네임과 포트폴리오 URL 규칙도 서버와 다르다(P3-3, P1-9). OpenAPI 스키마에서 타입을 생성하면 이런 어긋남의 상당 부분이 컴파일 시점에 드러난다.
- **첫 화면이 무겁다.** 홈 화면에 쓰지 않는 에디터와 스킬 아이콘 111개가 홈 진입 번들에 들어 있다(P1-10). 홈 화면이 내려받는 JS는 gzip 기준 약 750KB다.
- **접근성은 사실상 고려되지 않았다.** 키보드로 로그인할 수 없고, 포커스 표시가 전역에서 지워져 있다(P2-6).

## 요약

| ID | 항목 | 백엔드 |
|---|---|---|
| P0-1 | 탈퇴한 사용자가 남긴 알림 하나로 알림 패널이 렌더 중 예외를 던져 화면 전체가 404로 바뀜 | 불필요 |
| P0-2 | 지원자 관리 화면이 첫 9명만 보여 줘 10번째 지원자부터 승인, 거절할 수 없음 | 불필요 |
| P0-3 | DM을 포함한 전체 쿼리 캐시가 localStorage에 24시간 남고, 세션 만료와 탈퇴 때 지워지지 않음 | 불필요 |
| P1-1 | 렌더 오류, 500, 네트워크 오류, 청크 로드 실패가 모두 404 페이지로 보이고 캐시 복구 바운더리가 동작하지 않음 | 불필요 |
| P1-2 | 토큰 refresh 경로가 셋인데 진행 중인 refresh 공유는 인터셉터에만 있어, 동시 refresh로 로그아웃될 수 있음 | 불필요 |
| P1-3 | 생성, 승인, 삭제 등 거의 모든 변경 요청에 중복 제출 방지가 없음 | 불필요 |
| P1-4 | 메시지 전송 실패가 화면에 표시되지 않음 (서버가 보내는 오류 채널을 구독하지 않음) | 불필요 |
| P1-5 | 모집 마감 "무기한"을 고르면 제출 버튼이 비활성화됨 | 불필요 |
| P1-6 | 리뷰 모달에서 태그를 고른 뒤 닫기(X)를 누르면 리뷰가 저장됨 | 불필요 |
| P1-7 | 모바일 알림 버튼이 없는 경로(`/notification`)로 이동해 404가 됨 | 불필요 |
| P1-8 | 769~1439px 화면에서 가로 스크롤이 생기고 `html { font-size: 10px }`가 사용자 글자 크기 설정을 무시함 | 불필요 |
| P1-9 | 지원서의 포트폴리오 링크가 스킴 없는 URL이면 깨짐 | 불필요 |
| P1-10 | 홈 진입 번들에 에디터, 스킬 아이콘 전체, framer-motion이 포함됨 (gzip 약 750KB) | 불필요 |
| P1-11 | 고객 문의 이메일 주소 오타 | 불필요 |
| P2-1 | 모집글 삭제, 팀 수정 후 상세 캐시가 최대 5분(새로고침 후에도) 남음 | 불필요 |
| P2-2 | 토큰 갱신마다 WebSocket을 재연결하고, 이때 놓친 메시지를 동기화하지 않음 | 불필요 |
| P2-3 | 한글 입력 중 Enter 처리에 `isComposing` 검사가 없음 | 불필요 |
| P2-4 | 로딩, 에러 상태가 "빈 목록"으로 표시되고 무한 스크롤이 에러에서 반복 요청함 | 불필요 |
| P2-5 | 알림 목록과 대화 목록의 페이지네이션이 동작하지 않음 | 불필요 |
| P2-6 | 키보드로 로그인할 수 없고 포커스 표시가 전역에서 제거됨 | 불필요 |
| P2-7 | 모달, 클릭 대상, 색 대비 등 접근성 기반이 없음 | 불필요 |
| P2-8 | 운영 의존성 취약점 14건 (에디터 붙여넣기 XSS 포함) | 불필요 |
| P2-9 | PR CI, 테스트, 줄바꿈 정책이 없음 | 불필요 |
| P2-10 | 배포가 이전 청크를 바로 지워 열려 있던 탭의 페이지 이동이 깨짐 | 불필요 |
| P2-11 | 인증 확인이 끝날 때까지 모든 페이지가 빈 화면 | 불필요 |
| P3-1 | 좋아요 토글 경합과 카운트 미반영 | 불필요 |
| P3-2 | 댓글, 지원 뒤 상세를 통째로 다시 조회함 | 불필요 |
| P3-3 | 프로필 수정이 낡은 캐시로 전체 PUT을 보내고, 닉네임 검증이 서버 규칙과 다름 | 불필요 |
| P3-4 | 팀 이미지 업로드의 presigned URL 경합, 실패 무시, 메모리 누수 | 불필요 |
| P3-5 | 쿼리 키 팩토리가 없고 무효화 범위가 과하거나 부족함 | 불필요 |
| P3-6 | 라우트 로더가 캐시를 채우지 않아 같은 데이터를 두 번 조회 | 불필요 |
| P3-7 | 에디터가 렌더마다 재구성되고, 읽기 전용 화면에도 전체 에디터를 씀 | 불필요 |
| P3-8 | 대형 컴포넌트와 3중 복제 (`TeamApplicantPage`, `FieldBody`) | 불필요 |
| P3-9 | 디자인 토큰 하드코딩과 깨진 클래스 문자열 | 불필요 |
| P3-10 | 중복 컴포넌트와 서로 어긋난 스킬 목록 | 불필요 |
| P3-11 | 사이드바 접힘 상태의 로그인 아이콘 무동작, 팀 메뉴 닫힘 오류 | 불필요 |
| P3-12 | BottomSheet 포커스 점프, 모달 간 `body.overflow` 충돌 | 불필요 |
| P3-13 | 이미지 오류 상태가 대상이 바뀌어도 초기화되지 않음 | 불필요 |
| P3-14 | 모집글 본문 이미지의 호스트 제한이 없음 | 불필요 |
| P3-15 | 댓글 바이트 제한과 에디터 값 동기화가 입력 내용을 되돌리거나 지움 | 불필요 |
| P3-16 | GA 첫 페이지뷰 중복 집계 | 불필요 |
| P3-17 | 쓰이지 않는 코드, 선언되지 않은 의존성, 템플릿 그대로인 README | 불필요 |
| P3-18 | Kakao SDK SRI 해시와 CSP | - |

---

## P0

### P0-1. 탈퇴한 사용자가 남긴 알림 하나로 알림 패널이 렌더 중 예외를 던져 화면 전체가 404로 바뀜

- **위치**
  - `components/Notifications/index.tsx:31-95` (`getMessage`의 `data?.metadata.triggeredBy.username`), `:158-159` (`NOTIFICATION_CONFIG[data.type].Icon`)
  - `utils/kst-time.ts:32-34` (`throw new Error('Invalid UTC ISO string')`)
  - `pages/TeamApplicantPage.tsx:308, 515, 678` (`formatKstYyyyMmDd(applicant?.createdAt ?? '')`)
- **문제**
  - 서버는 알림 응답을 만들 때 `triggeredBy` 사용자를 다시 조회한다. 탈퇴한 사용자는 soft delete되어 조회되지 않으므로, 서버는 `metadata.triggeredBy`를 빼고 보낸다
  - 탈퇴할 때 서버가 지우는 알림은 두 가지뿐이다. 탈퇴자가 받은 알림과 탈퇴자의 글에 걸린 알림이다. 탈퇴자가 다른 사람에게 남긴 알림(지원서 도착, 팀원 합류, 팀원 이탈)은 그대로 남는다
  - 웹은 `data?.metadata.triggeredBy.username`으로 바로 접근한다. 그래서 `triggeredBy`가 없으면 TypeError를 던진다
  - 웹에 없는 알림 타입이 와도 `NOTIFICATION_CONFIG[data.type].Icon`에서 같은 예외가 난다. 지금은 서버와 웹의 알림 타입 9개가 일치한다
  - 날짜 포맷 함수는 빈 문자열을 받으면 예외를 던지는데, 호출부가 `?? ''`로 빈 문자열을 넘긴다
- **영향**: 지원한 사용자가 탈퇴하면, 그 지원서를 받은 매니저가 알림 버튼을 누를 때마다 화면 전체가 404로 바뀐다(P1-1). 알림이 영속 캐시에 남아 있어 새로고침해도 반복된다. 지원서 도착 알림은 매니저가 지원서를 확인하러 들어오는 주 경로라서, 지원 흐름이 여기서 끊긴다.
- **확인**: 코드 추적 (서버의 알림 응답 조립과 탈퇴 시 정리 범위까지 확인). 운영 DB에 해당 알림이 있는지는 확인하지 않았다
- **권장 방향**: `triggeredBy`가 없으면 "탈퇴한 사용자"로 표시한다. 알 수 없는 알림 타입은 기본 설정으로 그리거나 건너뛴다. 날짜 포맷 함수는 실패하면 `'-'`를 반환한다. API 응답의 enum은 모르는 값이 올 수 있다는 전제로 다룬다(`type: KnownType | (string & {})`).
- **백엔드**: 불필요. enum 값을 추가할 때의 배포 순서는 [서버와 함께 처리할 백로그](backlog-with-backend.md) S6

### P0-2. 지원자 관리 화면이 첫 9명만 보여 줘 10번째 지원자부터 승인, 거절할 수 없음

- **위치**: `pages/TeamApplicantPage.tsx:50-54`
- **문제**: `useGetTeamApplications({ size: 9 })`는 무한 쿼리인데, 이 쿼리의 `fetchNextPage`를 어디서도 부르지 않는다. "총 N명의 지원자"(`:183-189`)도 불러온 개수를 세므로 최대 9로 표시된다.
- **영향**: 지원자가 10명을 넘는 팀은 나머지 지원자를 화면에서 볼 수도 처리할 수도 없다. 서버는 2~3일 동안 처리되지 않은 지원서가 있으면 매일 자정에 매니저에게 다시 알린다. 그런데 이 알림을 받고 들어와도 해당 지원자는 화면에 없다. 미읽음 표시도 첫 페이지 기준이라 그 뒤 지원자에게는 점이 뜨지 않는다. 게시글을 선택하면 미읽음 계산용 쿼리가 반대로 모든 페이지를 size 30으로 끝까지 불러온다(`:77-92`).
- **확인**: 코드 추적. 지원자가 10명을 넘는 모집글이 운영에 있는지는 확인하지 않았다
- **권장 방향**: 목록 끝 감지(sentinel)나 "더보기"로 `fetchNextPage`를 연결하고, 총 지원자 수와 미읽음 수는 서버가 이미 팀 모집글 목록 응답에 넣어 주는 `applicantCount`, `unreadApplicationCount`를 쓴다. 미읽음을 세려고 지원자를 모두 불러오는 쿼리(`:56-99`)는 지운다. 읽음 처리 후에는 `team-applications` 전체를 무효화하지 말고 `setQueryData`로 해당 항목만 고친다.
- **주의**: 2페이지를 불러오게 고치면 서버 커서의 기존 결함이 바로 드러난다. 지금 지원자 목록의 커서는 지원서 ID 하나라서, 매니저가 1페이지 마지막 지원서를 승인하면 다음 페이지가 남은 대기 지원서를 건너뛴다. 서버의 커서 개선([서버와 함께 처리할 백로그](backlog-with-backend.md) S1)과 일정을 맞추거나, 승인과 거절 뒤에는 목록을 첫 페이지부터 다시 불러온다
- **백엔드**: 불필요. 필요한 값은 서버가 이미 내려 준다

### P0-3. DM을 포함한 전체 쿼리 캐시가 localStorage에 24시간 남고, 세션 만료와 탈퇴 때 지워지지 않음

- **위치**: `lib/persister.ts`, `main.tsx`의 `PersistQueryClientProvider`, `api/axiosInstance.ts:60`, `utils/authToken.ts:39`, `App.tsx:26`, `hooks/useUser.ts`의 `useDeleteUserMe`
- **문제**
  - `dehydrateOptions` 필터 없이 모든 성공한 쿼리를 `maxAge` 24시간으로 localStorage에 평문 저장한다. 대화 목록, 메시지, 알림, 내 지원 목록, 내 프로필이 모두 포함된다
  - 정상 로그아웃(`usePostLogout`)만 `queryClient.clear()`를 부른다. refresh 실패로 인한 강제 로그아웃 세 곳은 토큰만 지우고 캐시와 persister는 그대로 둔다. 탈퇴는 `['me']`만 지운다
  - `['me']`, `['my-applications']`, `['conversations', q]`, `['my-notifications']` 같은 키에 사용자 ID가 없다
  - 캐시 스키마 버전(`buster`)이 없다. 그래서 형식이 바뀌면 렌더 중 예외가 나고, 이를 `CacheErrorBoundary`의 새로고침으로 복구하려 하지만 그 바운더리는 동작하지 않는다(P1-1)
- **영향**
  - 공용 PC에서 세션이 만료되거나 탈퇴한 뒤에도 이전 사용자의 DM 내용이 localStorage에 남아 개발자 도구로 읽힌다
  - 같은 브라우저에서 다른 계정으로 로그인하면 재조회가 끝날 때까지 이전 사용자의 대화 목록과 알림이 잠깐 보인다
  - 기본 `gcTime`(5분)이 `maxAge`(24시간)보다 짧아서, 영속화로 얻는 이점은 최근 5분 안에 쓴 쿼리에만 해당한다
- **확인**: 코드 추적
- **권장 방향**
  - 영속화를 허용 목록 방식으로 바꾼다. `shouldDehydrateQuery`로 공개 데이터만 저장한다. 모집글 목록과 상세 응답(`PostDetailResponse`)에도 사용자별 값인 `liked`, `applicationStatus`(`types/api/posts.ts:78-79`)와 조회한 사용자의 팀 역할이 들어 있으므로, 이 값을 빼고 저장하거나 목록과 상세도 저장 대상에서 뺀다
  - 로그아웃 경로를 `signOut()` 하나로 모은다. 이 함수가 토큰, `queryClient.clear()`, `persister.removeClient()`, 메시지 스토어, 온보딩 상태를 함께 정리한다. 강제 로그아웃, 탈퇴, 정상 로그아웃 모두 이 함수만 부른다
  - `buster`에 빌드 버전을 넣어 배포 때마다 캐시를 버리게 한다. 그러면 `CacheErrorBoundary`의 새로고침 복구는 필요 없어진다
- **백엔드**: 불필요

---

## P1

### P1-1. 렌더 오류, 500, 네트워크 오류, 청크 로드 실패가 모두 404 페이지로 보이고 캐시 복구 바운더리가 동작하지 않음

- **위치**: `router.tsx:42` (`errorElement={<RouteErrorPage />}`), `pages/RouteErrorPage.tsx`, `components/CacheErrorBoundary.tsx`, `main.tsx`
- **문제**
  - `RouteErrorPage`는 401, 403이 아니면 모두 `NotFoundPage`를 보여 준다
  - 루트 레이아웃 라우트에 `errorElement`가 있어서, App, 사이드바, 모든 페이지의 렌더 오류를 라우터가 먼저 잡는다. 그 바깥의 `CacheErrorBoundary`까지 오류가 가지 않으므로, 이 바운더리의 캐시 삭제와 새로고침 로직은 실행되지 않는다
  - 사이드바와 헤더를 포함한 레이아웃 전체가 에러 페이지로 바뀐다
- **영향**: 서버 장애, 오프라인, 배포 직후 청크 로드 실패(P2-10), 코드 버그가 사용자에게 모두 "페이지를 찾을 수 없음"으로 보인다. 사용자는 다시 시도할 방법을 모르고, 팀은 장애를 404로 오인한다. 오류 수집(Sentry 등)도 없어서 운영 중 오류를 알 길이 없다.
- **확인**: 코드 추적
- **권장 방향**
  - 에러 화면을 404 / 401·403 / 일시적 오류(다시 시도) / 새 버전 배포(새로고침 안내)로 나눈다
  - 레이아웃 안쪽(`Outlet` 주변)에 바운더리를 두어 사이드바는 유지한다
  - 오류 수집 도구(예: Sentry)를 붙인다. 지금은 도입한 도구가 없어 계정 생성부터 해야 하고, 어느 도구를 쓸지는 팀이 정한다
  - P0-3의 `buster`를 적용한 뒤 `CacheErrorBoundary`를 지운다
- **백엔드**: 불필요

### P1-2. 토큰 refresh 경로가 셋인데 진행 중인 refresh 공유는 인터셉터에만 있어, 동시 refresh로 로그아웃될 수 있음

- **위치**: `api/axiosInstance.ts:15-55` (`refreshPromise`), `utils/authToken.ts`의 `ensureFreshAccessToken`, `loaders/routeLoaders.ts`의 `requireAuthLoader`, `hooks/useAuth.ts`의 `usePostRefresh` (미사용)
- **문제**: 인터셉터는 진행 중인 refresh를 공유하도록 만들었다. 주석에도 "BE rotation이 첫 응답 외 모두 reuse로 판정"한다고 적혀 있다. 하지만 `ensureFreshAccessToken`과 `requireAuthLoader`는 `postRefresh()`를 직접 불러서 이 공유를 우회한다. 데이터 라우터는 부모와 자식 로더를 병렬로 실행한다.
- **영향**
  - `/post/:postId/edit`를 새로고침하면 부모 `postLoader`(`ensureFreshAccessToken`)와 자식 `postEditLoader`가 함께 시작한다. 자식은 상세 조회를 기다린 뒤 `requireAuthLoader`를 부르므로(`loaders/routeLoaders.ts:142-150`) 두 refresh가 겹치는지는 타이밍에 달렸다. 둘 다 토큰이 없다고 보는 순간이 겹치면 refresh가 두 번 나가고, 서버의 재사용 탐지로 하나가 실패해 401 페이지가 나오거나 로그아웃된다
  - 알림 버튼(`SidebarMenu.tsx:114`)의 `ensureFreshAccessToken`과 다른 요청의 401 재시도가 겹칠 때도 같은 일이 생긴다
  - 서버는 재사용으로 판정하면 그 세션의 리프레시 토큰을 지운다. 그래서 요청 하나가 실패하는 데서 끝나지 않고, 그 브라우저의 로그인이 끊긴다
  - 같은 브라우저의 탭들은 리프레시 쿠키를 함께 쓴다. 그래서 탭 여러 개가 동시에 refresh해도 같은 일이 생긴다
- **확인**: 코드 추적 (서버의 재사용 판정과 세션 삭제까지 확인)
- **권장 방향**: `refreshAccessToken()` 하나만 두고 모든 경로가 같은 promise를 공유하게 한다. 쓰지 않는 `usePostRefresh`는 지운다. 로더의 인증 확인은 부모 레이아웃 라우트 한 곳으로 올린다. 탭 사이에서는 Web Locks API(`navigator.locks.request('auth-refresh', ...)`)로 refresh를 한 번에 하나씩만 실행한다.
- **백엔드**: 불필요. 서버가 직전 토큰을 잠시 허용하도록 바뀌더라도 웹의 중복 호출은 없애는 것이 맞다

### P1-3. 생성, 승인, 삭제 등 거의 모든 변경 요청에 중복 제출 방지가 없음

- **위치**: 아래 제출 버튼은 `!isValid`로만 비활성화되고 `isPending`이나 `isSubmitting`을 보지 않는다. 모집글 마감과 삭제 버튼(`TeamPostItem.tsx:28-29`, `PostDetailPage.tsx:113, 116`), 약관 동의(`TermsModal.tsx:188`), 댓글 수정(`CommentItem.tsx:41`)은 이미 `isPending`으로 막혀 있다
  - `TeamFormPage.tsx:151-184` (S3 업로드 뒤 팀 생성), `PostFormPage.tsx:114-132`, `ApplyModal.tsx:75-93`, `Comment/index.tsx:30-45`, `ProfileModal.tsx:123-175` (온보딩), `:431-436` (탈퇴)
  - `DecisionModal`, `TeamDeleteModal`, `TeamStatusModal`의 확인 버튼, 지원 승인과 거절(`TeamApplicantPage.tsx:781, 792`), 팀 완료(`TeamStatusPage.tsx:280`)
  - `TeamPostItem.tsx:142`는 확인 없이 클릭 한 번에 모집글을 삭제한다. `:124-133`는 되돌릴 수 없는 모집 마감을 클릭 한 번에 실행한다. 중복 요청은 `isPending`으로 막혀 있으므로 이 두 버튼에 필요한 것은 확인 단계다. 같은 삭제 버튼을 [서버와 함께 처리할 백로그](backlog-with-backend.md) S13이, 팀 완료 처리(`TeamStatusPage.tsx:280`)를 S2가 함께 고치므로 같은 PR로 묶거나 순서를 정한다
- **영향**: 더블클릭 한 번이면 팀과 모집글이 두 개씩 생기고, 지원과 댓글이 중복된다. 승인과 거절이 두 번 나가면 서버에서 같은 지원서의 상태 변경이 동시에 처리되는 경합을 웹이 직접 일으킨다.
- **확인**: 코드 추적
- **권장 방향**
  - 공통 `ConfirmDialog`가 `isPending`을 받아 확인 버튼을 비활성화한다. 세 확인 모달을 이것으로 합친다(P3-10)
  - 폼은 `formState.isSubmitting` 또는 mutation의 `isPending`으로 제출 버튼을 막는다
  - 되돌릴 수 없는 작업(삭제, 마감)에는 확인 단계를 둔다
- **백엔드**: 불필요. 더블클릭 중복은 웹의 버튼 비활성화로 막는다. 같은 모집글 중복 지원처럼 비즈니스 규칙상 허용되지 않는 중복은 서버가 원래 막아야 하는 것이라 이 항목과는 별개다

### P1-4. 메시지 전송 실패가 화면에 표시되지 않음 (서버가 보내는 오류 채널을 구독하지 않음)

- **위치**: `hooks/useStompClient.ts:112`
- **문제**: 서버는 메시지 처리에 실패하면 보낸 사람의 `/user/queue/errors`로 `ErrorResponse`를 보낸다. 실패 사유는 수신자 탈퇴, 내용 검증 실패, 자기 자신에게 전송, 레이트 리밋 초과(10초 30건, 1분 60건)다. 그런데 웹은 `/user/queue/messages`만 구독한다.
- **영향**: 전송이 실패해도 보낸 사람 화면에는 메시지가 보였다가, 새로고침하면 사라진다. 메시지는 지원자와 매니저가 연락하는 경로라서, 메시지가 사라지면 지원 흐름에도 영향을 준다.
- **확인**: 코드 추적 (서버의 STOMP 오류 처리와 레이트 리밋 확인)
- **권장 방향**: 연결 직후 `/user/queue/errors`를 구독해 안내를 띄우고, 임시 메시지를 실패로 표시한다. 오류 응답에는 어느 메시지가 실패했는지 알려 주는 식별자가 없다. 그래서 우선은 가장 오래된 미확정 임시 메시지를 실패로 표시한다(한 세션 안에서 처리 순서가 유지된다). 정확한 짝 맞추기는 [서버와 함께 처리할 백로그](backlog-with-backend.md) S4. 실패 표시는 연결이 끊겼을 때 쓰는 기존 "전송 실패"(`components/Message/MessageBubble.tsx:60-62`)를 그대로 쓰고, 레이트 리밋이면 잠시 뒤 다시 보내라는 안내를 함께 띄운다. 오류 페이로드의 형식과 레이트 리밋의 `code`(`TOO_MANY_REQUESTS`)는 [서버와 함께 처리할 백로그](backlog-with-backend.md)의 "서버 오류 응답 형식"에 있다
- **백엔드**: 불필요. 서버는 이미 오류를 보낸다

### P1-5. 모집 마감 "무기한"을 고르면 제출 버튼이 비활성화됨

- **위치**: `components/Field/FieldBody.tsx:1234-1238`, `pages/PostFormPage.tsx:169-181`
- **문제**: "무기한"의 값은 `null`인데 필드 규칙이 `required: true`다. react-hook-form은 `null`을 값 없음으로 보고 검증에 실패시킨다.
- **영향**: 무기한 모집글을 만들 수 없다. 마감일이 `null`인 기존 글은 수정도 할 수 없다.
- **확인**: 코드 추적 (react-hook-form 7.71.1의 `required` 판정 확인)
- **권장 방향**: "선택 안 함"은 `undefined`, "무기한"은 `null`로 나누고, `validate: (v) => v !== undefined`로 검증한다.
- **백엔드**: 불필요

### P1-6. 리뷰 모달에서 태그를 고른 뒤 닫기(X)를 누르면 리뷰가 저장됨

- **위치**: `components/Modal/ReviewModal.tsx:114`, `:148-150`
- **문제**: `<form>` 안에 있는 `<button onClick={onClose}>`에 `type`이 없어서 기본값인 `submit`으로 동작한다. 웹에는 태그 검증이 없지만, 서버는 태그를 1~3개 요구한다.
- **영향**
  - 태그를 고르지 않고 X를 누르면 400 요청이 나간다
  - 태그를 고른 뒤 마음을 바꿔 X를 누르면 리뷰가 저장되고, 그 팀원의 협업 온도에 반영된다. 사용자가 고치기 전까지 남는다
  - 협업 온도는 다른 사람이 팀원을 고를 때 보는 신뢰 지표다. 그래서 의도하지 않은 리뷰가 들어가는 것은 일반적인 폼 버그보다 비용이 크다
- **확인**: 코드 추적 (서버 요청 검증 확인)
- **권장 방향**: 닫기 버튼에 `type="button"`과 `aria-label`을 넣고, 태그에 서버와 같은 1~3개 검증 규칙을 둔다. 같은 실수가 다시 생기지 않도록 lint 규칙 `react/button-has-type`을 켠다.
- **백엔드**: 불필요

### P1-7. 모바일 알림 버튼이 없는 경로(`/notification`)로 이동해 404가 됨

- **위치**: `components/MobileHeader/index.tsx:45`, `components/Sidebar/SidebarMenu.tsx:38`, `router.tsx`
- **문제**: 라우터에 `/notification` 경로가 없어 `*` 경로의 `NotFoundPage`로 떨어진다.
- **영향**: 모바일 사용자는 알림을 볼 방법이 없다.
- **확인**: 코드 추적
- **권장 방향**: 모바일 알림 페이지를 라우트로 추가하거나, 기존 `Notifications` 패널을 전체 화면 시트로 연다. 둘 중 어느 쪽으로 할지는 디자인 확인이 필요하다. 경로 문자열은 `routes.ts` 상수 한 곳에서 관리해 같은 문제가 다시 생기지 않게 한다.
- **백엔드**: 불필요

### P1-8. 769~1439px 화면에서 가로 스크롤이 생기고 `html { font-size: 10px }`가 사용자 글자 크기 설정을 무시함

- **위치**: `App.tsx:42` (`min-w-[144rem] max-sm:min-w-0`), `tailwind.config.ts:82` (`max-sm` = 768px), `styles/global.css` (`html { font-size: 10px }`)
- **문제**
  - 768px보다 넓은 화면에서는 최소 너비 1440px가 강제된다
  - 루트 글자 크기를 px로 고정해서, 브라우저의 기본 글자 크기 설정이 rem 기반 레이아웃에 반영되지 않는다
- **영향**: 1280px, 1366px 노트북과 태블릿 가로 모드에서 페이지 전체에 가로 스크롤이 생긴다. 큰 글자를 설정한 사용자의 설정이 무시된다(WCAG 1.4.4).
- **확인**: 코드 추적. 노트북 해상도 비중은 GA로 확인할 것
- **권장 방향**: 최소 너비를 강제하지 말고 1024px, 1280px 구간의 레이아웃을 따로 정의한다. 이 구간의 레이아웃은 디자인 확인이 필요하다. 루트 크기는 `62.5%`로 바꿔 사용자 설정에 비례하게 한다. 지금 쓰는 `rem` 값은 그대로 둬도 된다.
- **백엔드**: 불필요

### P1-9. 지원서의 포트폴리오 링크가 스킴 없는 URL이면 깨짐

- **위치**: `components/Modal/ApplyModal.tsx:167-177`, `pages/TeamApplicantPage.tsx:383, 588, 750`, `pages/ProfilePage.tsx:82`
- **문제**: 서버는 `example.com`처럼 스킴 없는 URL도 유효하다고 보고, 입력값 그대로 저장한다. 서버 검증기는 검사할 때만 `https://`를 붙인다. 프로필 화면은 스킴을 붙여 링크를 만들지만, 지원자 관리 화면은 저장된 값을 `href`에 그대로 넣는다. 그리고 첫 번째 URL만 보여 준다.
- **영향**: 스킴 없이 입력된 포트폴리오는 waggle.lol 아래 상대 경로 링크가 되어 404 화면으로 간다. 매니저가 지원서를 검토할 때 보는 핵심 정보다.
- **참고**: React 19가 `javascript:` URL을 막고 서버도 http(s)만 허용하므로, 보안 문제는 아니다.
- **권장 방향**: `ProfilePage`의 정규화를 공통 유틸로 빼서 포트폴리오 URL을 그리는 모든 곳에 쓰고, 여러 개를 모두 보여 준다.
- **확인**: 코드 추적 (서버 URL 검증기 확인)
- **백엔드**: 불필요

### P1-10. 홈 진입 번들에 에디터, 스킬 아이콘 전체, framer-motion이 포함됨 (gzip 약 750KB)

- **위치**: `utils/SkillIcon.tsx:9-24`, `pages/MainPage.tsx:13` → `Modal/ProfileModal.tsx` → `Field/FieldMaster.tsx` → `Field/FieldBody.tsx`, `components/Sidebar/SidebarItem.tsx:3`, `styles/global.css:5-10`
- **문제**: 빌드 결과(`dist/assets`)와 소스맵으로 확인한 큰 청크 세 개는 모두 홈 화면에서 내려받는다.

  | 청크 | 크기 (gzip) | 원인 |
  |---|---|---|
  | `skillMap-*.js` | 631KB (350KB) | `import.meta.glob('...skill/{small,large}/*.svg', { query: '?react', eager: true })`로 SVG 111개를 모두 React 컴포넌트로 만든다. 그중 13개에는 base64 PNG가 들어 있어 약 319KB를 차지하고, 43개 파일은 쓰이지 않는다 |
  | `FieldMaster-*.js` | 549KB (176KB) | TipTap과 ProseMirror 에디터. 홈 화면이 온보딩용 `ProfileModal`을 정적으로 import하고, 이 모달이 에디터가 들어 있는 `FieldBody`를 통째로 가져온다 |
  | `index-*.js` | 704KB (227KB) | 사이드바 드롭다운 하나에 쓰는 framer-motion 약 430KB가 포함된다 |

  폰트 `PretendardVariable.woff2`는 2.06MB인데 서브셋, preload, 대체 글꼴이 없다. `format('woff-variations')`도 실제 형식(woff2)과 다르다.
- **영향**: 모바일 회선에서 첫 화면 표시와 상호작용이 크게 늦어진다. 모집글 카드(`MainCard`)가 아이콘 청크를 쓰기 때문에, 아이콘 청크가 첫 화면을 그리는 데 필요한 경로에 있다.
- **확인**: 실행 확인 (`vite build` 결과와 소스맵 분석)
- **권장 방향**
  - 스킬 아이콘: 래스터가 들어 있는 아이콘을 벡터나 WebP로 바꾸고, SVGO를 적용하고, 쓰지 않는 파일은 지운다. 크기별 사본 대신 하나를 CSS로 줄이고, `?url` + `<img loading="lazy">`나 스프라이트로 불러온다
  - 에디터: `ProfileModal`, `TermsModal`을 `lazy`로 바꾸고, `FieldBody`에서 에디터를 별도 모듈로 떼어 폼 페이지에서만 불러온다
  - framer-motion: CSS 전환(`grid-template-rows`)으로 바꾸거나 `LazyMotion`을 쓴다
  - 폰트: Pretendard dynamic subset을 쓰고 대체 글꼴 스택과 `preload`를 추가한다
  - 회귀를 막도록 CI에 번들 크기 예산(`size-limit` 등)을 둔다
- **백엔드**: 불필요

### P1-11. 고객 문의 이메일 주소 오타

- **위치**: `components/Sidebar/index.tsx:149, 152`
- **문제**: `team.waggle.offcial@gmaill.com`로 되어 있다. `offcial`도 틀렸고 도메인도 `gmaill.com`이다.
- **영향**: 문의 메일이 존재하지 않는 주소나 제3자 도메인으로 간다. 고치는 비용이 거의 없으면서 신뢰와 개인정보에 직접 영향을 주므로 P1로 두었다.
- **확인**: 코드 추적
- **권장 방향**: `waggle.official@gmail.com`으로 고치고 상수로 뺀다. 노션 화면설계서에 적힌 문의 주소이고, 실제로 쓰는 주소임을 확인했다. 기존 값의 `team.` 접두어는 붙이지 않는다.
- **백엔드**: 불필요

---

## P2

### P2-1. 모집글 삭제, 팀 수정 후 상세 캐시가 최대 5분(새로고침 후에도) 남음

- **위치**: `hooks/usePost.ts:27-34` (`post-detail` `staleTime` 5분), `:204-212` (`useDeletePost`), `hooks/useTeam.ts:46-57` (`useUpdateTeam`, `useDeleteTeam`), `loaders/routeLoaders.ts`의 `postLoader` (`ensureQueryData`)
- **문제**: 모집글을 삭제해도 `['team-posts', teamId]`만 무효화한다. `postLoader`의 `ensureQueryData`는 캐시가 있으면 요청을 보내지 않는다. 팀을 수정하거나 삭제해도 팀 정보가 들어 있는 `post-detail`과 `team-detail`은 그대로다.
- **영향**: 글을 삭제한 뒤 뒤로 가기를 하면 삭제된 글이 수정, 삭제 버튼과 함께 다시 보인다. 캐시가 영속화되어 있어 새로고침해도 마찬가지다. 팀 이름과 이미지를 바꿔도 모집글 화면에는 최대 5분 동안 예전 값이 나온다.
- **확인**: 코드 추적
- **권장 방향**: 삭제 시 `removeQueries(['post-detail', postId])`를 부르고 `['posts']`를 무효화한다. 팀을 수정하면 `team-detail`과 `post-detail`을 무효화한다. 이런 규칙은 P3-5의 쿼리 키 팩토리와 함께 정리한다.
- **백엔드**: 불필요

### P2-2. 토큰 갱신마다 WebSocket을 재연결하고, 이때 놓친 메시지를 동기화하지 않음

- **위치**: `hooks/useStompClient.ts:58-243`
- **문제**
  - 연결 effect의 의존성이 `[accessToken]`이다. 그래서 액세스 토큰이 갱신될 때마다(1시간마다, 또는 401 재시도 때마다) STOMP 연결을 끊고 다시 맺는다. 연결 인증은 일회용 WS 토큰으로 이미 끝났으므로 액세스 토큰이 바뀌었다고 다시 연결할 필요가 없다
  - cleanup이 `isFirstConnectRef.current = true`로 되돌려서, 이렇게 다시 맺은 연결은 "첫 연결"로 취급되고 대화 목록과 메시지를 무효화하지 않는다
  - 메시지를 하나 받을 때마다 대화 목록을 `setQueryData`로 고친 직후 `['conversations']`(검색 결과 포함 전체)와 `['messages', senderId]`를 무효화한다. 앞의 낙관적 업데이트가 의미가 없어지고, 메시지 하나에 재조회가 여러 번 일어난다
- **영향**: 토큰이 갱신되는 순간 도착한 메시지는 새로고침할 때까지 보이지 않을 수 있다. 대화가 활발하면 요청 수가 메시지 수에 비례해 늘어난다.
- **확인**: 코드 추적
- **권장 방향**: 연결 여부는 `isLoggedIn` boolean에만 의존시키고, 재연결 시 동기화 여부는 "이전에 연결된 적이 있는지"로 판단한다. 받은 메시지는 캐시에 직접 반영하고, 무효화는 재연결 때만 한다.
- **백엔드**: 불필요

### P2-3. 한글 입력 중 Enter 처리에 `isComposing` 검사가 없음

- **위치**: `hooks/useChatLogic.ts:391-396` (메시지), `pages/TeamFormPage.tsx:138`, 그 밖의 `onKeyDown` Enter 처리
- **문제**: 코드 전체에 `isComposing`이나 `compositionend` 처리가 없다. 한글 조합 중 Enter를 누르면 브라우저에 따라 keydown이 조합 중에 한 번, 조합이 끝난 뒤 한 번 들어온다. `handleSend`의 100ms 연속 전송 차단(`:292`)은 이 증상을 막으려는 우회로 보인다.
- **영향**: 마지막 글자가 입력창에 남거나, 메시지가 두 번 나가거나, 마지막 글자만 따로 전송된다. 주 사용자가 한국어 사용자라 영향이 크다.
- **확인**: 추정. 코드에 처리가 없는 것은 확인했고, 브라우저별 재현은 하지 않았다
- **권장 방향**: `if (e.nativeEvent.isComposing) return;`을 Enter 처리 앞에 넣고, 100ms 차단은 지운다. 공통 `useEnterSubmit` 훅으로 모은다.
- **백엔드**: 불필요

### P2-4. 로딩, 에러 상태가 "빈 목록"으로 표시되고 무한 스크롤이 에러에서 반복 요청함

- **위치**
  - `pages/MainPage.tsx:153` (`!isLoading && posts.length === 0`이라 로딩 중에는 숨기지만, 에러면 "등록된 모집글이 없습니다."를 보여 준다), `:89-114` (IntersectionObserver)
  - `pages/TeamApplicantPage.tsx:207-208, 409-410`, `pages/TeamPostManagementPage.tsx:12, 26`
  - `pages/TeamHomePage.tsx:184, 220` (로딩 중 'WAGGLE', '팀 소개가 들어가는 자리입니다.'), `pages/TeamStatusPage.tsx:94` (로딩 중 상태 기본값 `'PREPARING'`)
- **문제**: 대부분의 화면이 `isPending`과 `isError`를 따로 다루지 않고 `data = []` 같은 기본값으로 그린다. 홈 화면의 observer는 `isFetchingNextPage`가 바뀔 때마다 새로 만들어지는데, 새 observer는 sentinel이 보이면 바로 콜백을 실행한다.
- **영향**: 서버 장애가 "모집글이 없다"나 "지원자가 없다"로 보인다. 팀 화면에서는 잘못된 상태 카드가 잠깐 나타난다. 다음 페이지 요청이 실패하면 observer가 다시 만들어지면서 같은 요청을 계속 보낸다.
- **확인**: 코드 추적
- **권장 방향**
  - 목록 화면의 상태 분기를 `<QueryState>`(로딩 / 에러 + 다시 시도 / 빈 목록 / 데이터) 같은 공통 컴포넌트로 통일한다
  - 무한 스크롤은 공통 `useInfiniteScroll` 훅 하나로 모은다. 이 훅은 observer를 하나만 유지하고, `isFetchNextPageError`이면 자동 요청을 멈춘다
- **백엔드**: 불필요

### P2-5. 알림 목록과 대화 목록의 페이지네이션이 동작하지 않음

- **위치**: `hooks/useUser.ts:205` (`useGetNotifications`), `components/Notifications/index.tsx:132`, `components/Message/MessageList.tsx:41-51, 83-87`
- **문제**
  - 알림 API는 커서 응답(`nextCursor`, `hasNext`)을 주는데, 웹은 일반 `useQuery`로 첫 페이지만 그린다. 헤더에는 `total`을 보여 준다
  - 대화 목록은 컨테이너의 `onScroll`에서만 다음 페이지를 부른다. 첫 페이지가 화면을 다 채우지 못하면 스크롤 이벤트가 생기지 않는다
- **영향**: 오래된 알림에는 접근할 수 없고, 표시된 개수와 실제 목록이 다르다. 세로로 큰 화면에서는 대화 목록 뒷부분을 불러올 수 없다.
- **확인**: 코드 추적
- **권장 방향**: 둘 다 P2-4의 공통 무한 스크롤 훅으로 바꾼다.
- **백엔드**: 불필요

### P2-6. 키보드로 로그인할 수 없고 포커스 표시가 전역에서 제거됨

- **위치**: `components/Modal/LoginModal.tsx:33-34, 47-54`, `styles/global.css:36-53`
- **문제**
  - Google과 Kakao 로그인 버튼이 `<svg onClick>`이라 포커스도 실행도 되지 않는다. 닫기 버튼은 `onClick`이 안쪽 SVG에 있어서 Enter와 Space에 반응하지 않는다
  - `button`, `input`, `textarea`의 `outline`을 모두 `none`으로 지웠고, 그것을 대신할 `focus-visible` 스타일은 코드 전체에 없다. 에디터(`FieldBody.tsx:337`)도 `focus:outline-none`으로 지운다
- **영향**: 마우스 없이는 로그인할 수 없다. 키보드 사용자는 포커스가 어디 있는지 알 수 없다(WCAG 2.4.7). 서비스 진입의 첫 단계가 막히므로 접근성 항목 중 가장 먼저 고친다.
- **확인**: 코드 추적
- **권장 방향**: 로그인 버튼을 `<button aria-label="Google로 로그인">`으로 감싸고, outline 리셋을 지운 뒤 디자인 토큰 기반의 `:focus-visible` 링을 base 스타일에 넣는다. 나머지 접근성 항목은 P2-7에서 다룬다.
- **백엔드**: 불필요

### P2-7. 모달, 클릭 대상, 색 대비 등 접근성 기반이 없음

- **위치**: `hooks/useModal.ts`, 모든 `role="dialog"` 모달, 그 밖에 아래에 적은 곳들
- **문제**
  - 모달이 포커스를 안으로 옮기지 않고, Tab을 가두지 않고, 닫은 뒤 포커스를 돌려주지 않는다. `aria-labelledby`도 대부분 없다. 모달마다 Escape 리스너를 따로 달아서, Escape 한 번에 겹친 모달이 모두 닫힌다
  - 클릭 가능한 `div`/`svg`/`img`가 수십 곳 있다. 지원서 펼치기 버튼(`TeamApplicantPage.tsx:337-362`)이 그중 하나라서 키보드로는 지원서를 열 수 없다. 사이드바 메뉴, 알림 항목, 케밥 메뉴, 모집 토글도 마찬가지다
  - 아이콘만 있는 버튼(하단 탭 5개, 공유, 좋아요, 삭제, 에디터 툴바 등)에 접근 가능한 이름이 없다
  - 본문 보조 텍스트에 쓰는 `black-60`(3.41:1), `black-50`(2.55:1), `black-40`(1.96:1)이 흰 배경에서 WCAG AA(4.5:1)에 못 미친다
- **영향**: 키보드와 스크린리더 사용자는 핵심 흐름(지원서 확인, 메뉴, 알림)을 쓸 수 없다.
- **확인**: 코드 추적. 대비는 계산값이다
- **권장 방향**
  - 다이얼로그, 메뉴, 스위치는 직접 만들지 말고 헤드리스 라이브러리(Radix UI, React Aria)를 쓴다
  - `eslint-plugin-jsx-a11y`를 켜고, 새로 생기는 위반부터 막는다
  - 텍스트에 쓰는 회색 토큰은 디자이너와 함께 AA를 만족하도록 조정한다
- **백엔드**: 불필요

### P2-8. 운영 의존성 취약점 14건 (에디터 붙여넣기 XSS 포함)

- **위치**: `package.json`, `package-lock.json`
- **문제**: `npm audit --omit=dev` 결과 high 12건, moderate 2건이다. 이 앱에 실제로 해당하는 것은 다음과 같다.
  - `prosemirror-view`의 붙여넣기 XSS, `@tiptap/core`의 `__proto__` 속성 처리, `markdown-it`/`linkify-it`의 ReDoS: 모집글 에디터와 뷰어에 직접 해당한다
  - `axios` (직접 의존성)
  - `react-router` 취약점은 RSC와 SSR 경로라 이 SPA에는 해당하지 않는다
- **확인**: 실행 확인 (`npm audit`, `npm outdated`)
- **권장 방향**: `npm audit fix`로 마이너 업데이트를 반영하고 에디터 화면을 회귀 확인한다. 정기 업데이트를 위해 Dependabot이나 Renovate를 켠다.
- **백엔드**: 불필요

### P2-9. PR CI, 테스트, 줄바꿈 정책이 없음

- **위치**: `.github/workflows/` (`deploy.yml`, `gemini-review.yml`뿐), `package.json`의 `scripts`, `.gitattributes` 없음
- **문제**
  - PR에서 돌아가는 검증은 Gemini 리뷰 코멘트뿐이다. 타입 검사는 `main` 배포 빌드의 `tsc -b`에서 처음 실행되고, lint는 CI 어디에서도 돌지 않는다
  - 테스트 러너와 테스트 파일이 없다
  - `.gitattributes`가 없어서 Windows(`core.autocrlf=true`)로 체크아웃하면 파일이 CRLF가 된다. 이 상태에서 `npm run lint`를 돌리면 Prettier `endOfLine` 위반으로 오류가 17,631개 나서 lint를 쓸 수 없다
  - `tsconfig`의 `noUnusedLocals`, `noUnusedParameters`가 꺼져 있다
- **영향**: P1-6, P1-5, P1-7 같은 결함이 리뷰를 통과해 운영에 나간다. 배포가 깨지는 시점이 머지 이후다.
- **확인**: 실행 확인 (`tsc -b` 통과, `eslint .` 결과)
- **권장 방향**
  - `.gitattributes`에 `* text=auto eol=lf`를 넣는다
  - PR 워크플로에서 `tsc -b`, `eslint`, `vite build`, 번들 크기 예산(P1-10)을 돌린다
  - Vitest와 Testing Library를 도입한다. 첫 테스트 대상은 순수 로직(`kst-time`, `authToken`, 바이트 계산, 메시지 그룹핑)과 P1-2, P1-3처럼 다시 생기기 쉬운 흐름이다. 핵심 흐름(로그인, 지원, 메시지)은 Playwright E2E 몇 개로 지킨다
- **백엔드**: 불필요

### P2-10. 배포가 이전 청크를 바로 지워 열려 있던 탭의 페이지 이동이 깨짐

- **위치**: `.github/workflows/deploy.yml` (`aws s3 sync ... --delete`), `router.tsx`의 `lazy()` 라우트
- **문제**: 배포할 때 새 빌드에 없는 해시 청크를 S3에서 지운다. 배포 전에 열어 둔 탭은 예전 `index.html`의 청크 이름으로 lazy 라우트를 요청하다가 404를 받는다. 청크 로드 실패를 처리하는 코드도 없다.
- **영향**: 배포 직후 사이트를 쓰던 사용자가 다른 페이지로 이동하면 404 화면이 나온다(P1-1).
- **확인**: 코드 추적
- **권장 방향**: `--delete`를 빼고, 이전 청크는 S3 수명 주기 규칙으로 며칠 뒤 정리한다. Vite의 `vite:preloadError` 이벤트를 받아 한 번만 새로고침하도록 처리한다.
- **백엔드**: 불필요

### P2-11. 인증 확인이 끝날 때까지 모든 페이지가 빈 화면

- **위치**: `App.tsx:21-39` (`if (isAuthLoading) return null`), `pages/LoginPage.tsx:58` (`<div>Loading...</div>`)
- **문제**: 액세스 토큰을 메모리에만 두므로 새로고침할 때마다 refresh 요청이 끝나야 레이아웃이 그려진다. 비로그인 사용자도 이 refresh 실패를 기다린다.
- **영향**: 모든 진입에서 첫 화면이 refresh 왕복 시간만큼 늦어지고, 서버가 느리면 그동안 흰 화면이 보인다.
- **확인**: 코드 추적
- **권장 방향**: 레이아웃(사이드바, 헤더 뼈대)과 공개 데이터 요청은 인증 확인과 병렬로 시작하고, 로그인 상태에 의존하는 부분만 기다리게 한다. 로그인 콜백 화면은 디자인된 로딩 상태를 쓴다.
- **백엔드**: 불필요

---

## P3

### P3-1. 좋아요 토글 경합과 카운트 미반영

- **위치**: `pages/PostDetailPage.tsx:139-141, 308-326`, `components/common/Cards/MainCard/MainCard.tsx:78-97, 199`
- **문제**: 로컬 `isLiked` 상태를 바로 뒤집고 요청을 보내는데, 진행 중인 요청을 막지 않는다. 실패하면 `!nextIsLiked`로 되돌린다. 카드의 좋아요 수는 요청이 성공해 `['posts']`, `['team-posts']`를 다시 조회한 뒤에야 바뀌고(`usePost.ts:77-78, 101-102`), 상세 화면의 좋아요 수도 성공한 뒤에야 바뀐다.
- **영향**: 빠르게 연타하면 좋아요와 취소 요청이 동시에 나가고, 서버 처리 순서에 따라 화면과 서버 상태가 어긋난다. 하트는 채워졌는데 숫자는 그대로인 상태가 보인다.
- **확인**: 코드 추적
- **권장 방향**: 낙관적 업데이트는 쿼리 캐시의 `onMutate`/`onError`에서 한 번만 하고, 따로 두던 로컬 상태는 지운다. 같은 대상에 대한 요청은 TanStack Query v5의 `scope: { id: 'like-${postId}' }`로 순서대로 처리한다. 북마크, 팔로우, 댓글 좋아요에도 같은 훅을 쓴다.
- **백엔드**: 불필요. 서버가 중복 요청을 500 대신 409로 응답하면 남은 경합도 정리된다

### P3-2. 댓글, 지원 뒤 상세를 통째로 다시 조회함

- **위치**: `hooks/useComment.ts:29, 56`, `hooks/useTeam.ts:129` (`['post-detail']` 전체 무효화), `loaders/routeLoaders.ts`의 `postEditLoader` (`getPostDetail` 직접 호출)
- **문제**: 상세 조회 API가 조회수를 올린다(`usePost.ts:71` 주석). 그런데 댓글 작성과 삭제, 지원, 수정 화면 진입이 모두 상세 조회를 다시 부른다.
- **영향**: 댓글 하나, 지원 하나마다 상세 전체를 다시 받는다. 조회수도 함께 오르지만, 서버는 반복 조회도 모두 세기로 정했다(활성 사용자가 많아 보이게 하려는 목적). 그래서 여기서 줄이려는 것은 조회수가 아니라 불필요한 요청이다.
- **확인**: 코드 추적. 서버는 상세 조회마다 조회수를 올린다. 새로고침과 작성자 본인 조회까지 모두 세는 것은 프로젝트 초기라 서버가 의도한 결정이다
- **권장 방향**: 댓글 수와 지원 상태는 `setQueryData`로 갱신하고 상세를 다시 조회하지 않는다. 수정 화면은 이미 받은 상세 캐시가 있으면 그것을 쓴다. 조회수를 올리지 않는 상세 API는 서버에 없다.
- **백엔드**: 불필요

### P3-3. 프로필 수정이 낡은 캐시로 전체 PUT을 보내고, 닉네임 검증이 서버 규칙과 다름

- **위치**: `components/Modal/ProfileModal.tsx:149-156, 268-287`, `hooks/useUser.ts:131-153` (`useUpdateProfileImage`)
- **문제**
  - 이미지 변경과 프로필 수정이 모두 `['me']` 캐시로 전체 객체를 만들어 PUT한다. 서버의 PUT은 요청에 없는 필드를 비운다. 그래서 두 요청이 시간상 겹치면 나중 요청이 앞의 변경을 덮어쓴다
  - 닉네임 규칙이 서버와 다르다. 웹은 6~15바이트를 검사하고, 빈 문자열은 통과시킨다. 서버는 한글·영문·숫자 2~20자를 요구한다
- **영향**: 드물게 새로 올린 이미지가 예전 값으로 돌아간다. 웹이 통과시킨 닉네임이 서버에서 400으로 거부되거나, 서버가 허용하는 닉네임을 웹이 막는다. 어느 쪽이든 사용자는 이유를 알 수 없다.
- **확인**: 코드 추적 (서버의 PUT 의미와 닉네임 검증 확인)
- **권장 방향**: PUT 본문은 요청 직전의 최신 프로필로 만든다(`queryClient.fetchQuery`). 닉네임 규칙은 서버와 똑같이 맞춘다. 요청 타입이 `object`인 mutation들(`usePutUserMe`, `useCreatePosts` 등)에는 명시적인 타입을 둔다.
- **백엔드**: 불필요

### P3-4. 팀 이미지 업로드의 presigned URL 경합, 실패 무시, 메모리 누수

- **위치**: `pages/TeamFormPage.tsx:77, 84-94, 152-160`
- **문제**
  - presigned URL은 파일을 놓는 시점에 받고, 실제 업로드는 제출할 때 한다. 파일을 빠르게 두 번 바꾸면 `file`과 `presignedUrl`이 서로 다른 파일의 것이 될 수 있다
  - 업로드가 실패하면 조용히 `return`하고, 사용자에게 알리지 않는다
  - `URL.createObjectURL`로 만든 URL을 해제하지 않는다
  - `accept`에 `.jpeg`가 빠져 있고 크기 제한이 없다. 에디터는 2MB 제한이 있다
- **영향**: 이미지 업로드가 403으로 실패하거나 아무 반응이 없다.
- **확인**: 코드 추적. URL 만료 시간은 추정이다
- **권장 방향**: presigned URL 발급과 PUT을 제출 시점에 한 번에 하는 공통 `uploadImage(file, kind)`를 만들고, 프로필, 팀, 본문 이미지 업로드를 모두 이것으로 처리한다. 형식과 크기 검증도 이 함수 한 곳에서 한다.
- **백엔드**: 불필요. 서버가 업로드 방식을 바꿀 가능성은 [서버와 함께 처리할 백로그](backlog-with-backend.md) S12

### P3-5. 쿼리 키 팩토리가 없고 무효화 범위가 과하거나 부족함

- **위치**: `hooks/*.ts` 전체
- **문제**: 쿼리 키를 문자열 배열로 흩어서 쓴다(`'me'`, `'user-me-team'`, `'my-applications'`, `'team-applications'`). 그래서 무효화 범위를 맞추기 어렵다.
  - 과한 곳: 댓글 변경이 `['comment']` 전체를 무효화해 다른 글의 댓글까지 다시 불러온다. 읽음 처리 하나가 `['team-applications']` 전체를 무효화한다
  - 부족한 곳: P2-1. 그리고 자기 자신을 팀에서 내보내도(`useDeleteTeamMember`) `user-me-team`을 무효화하지 않는다
- **권장 방향**: 도메인별 키 팩토리(`postKeys.detail(id)`)와 `queryOptions`로 모으고, mutation마다 영향을 받는 키를 명시한다. 사용자 범위 데이터에는 사용자 ID를 넣는다(P0-3).
- **확인**: 코드 추적
- **백엔드**: 불필요

### P3-6. 라우트 로더가 캐시를 채우지 않아 같은 데이터를 두 번 조회

- **위치**: `loaders/routeLoaders.ts`의 `teamLoader`, `teamManageLoader`, `userLoader`, `partnerLoader`, `postEditLoader`
- **문제**: 로더가 API 함수를 직접 부르고, 컴포넌트가 같은 데이터를 `useQuery`로 다시 부른다. `postLoader`만 `ensureQueryData`를 쓴다. `teamManageLoader`는 팀 상세와 내 팀 목록을 차례로 요청한다.
- **영향**: 팀과 사용자 화면 진입마다 같은 요청이 두 번 나간다.
- **권장 방향**: 모든 로더를 `queryClient.ensureQueryData(xxxQueryOptions)`로 바꾸고, 서로 의존하지 않는 요청은 `Promise.all`로 묶는다.
- **확인**: 코드 추적
- **백엔드**: 불필요

### P3-7. 에디터가 렌더마다 재구성되고, 읽기 전용 화면에도 전체 에디터를 씀

- **위치**: `components/Field/FieldBody.tsx:313-407`, `components/Field/FieldViewer.tsx:28, 34-40`
- **문제**: `extensions`와 `editorProps`를 렌더마다 새로 만든다. `@tiptap/react` 3.18은 이를 옵션 변경으로 보고, 키 입력마다 `setOptions`로 에디터를 다시 설정한다. 모집글 상세의 본문 표시도 전체 에디터 인스턴스로 하고, 마운트할 때 마크다운을 두 번 파싱한다.
- **권장 방향**: 확장과 옵션은 모듈 상수나 `useMemo`로 둔다. 읽기 화면은 마크다운을 HTML로 바꾸는 가벼운 렌더러에 sanitize를 더해 쓰는 방안을 검토한다.
- **확인**: 코드 추적 (라이브러리 소스 확인)
- **백엔드**: 불필요

### P3-8. 대형 컴포넌트와 3중 복제 (`TeamApplicantPage`, `FieldBody`)

- **위치**: `pages/TeamApplicantPage.tsx` (804줄), `components/Field/FieldBody.tsx` (1,264줄), `pages/PostDetailPage.tsx` (586줄)
- **문제**
  - 지원자 행이 반응형 변형별로 거의 같은 코드로 세 번 복제되어 있고(`:229-394`, `:434-599`, `:602-761`), 셋 다 항상 DOM에 있으면서 CSS로만 숨긴다
  - `:432`에서 키가 없는 `<>`를 map 안에 쓰고, 그 안의 두 자식이 같은 `key={applicant.id}`를 쓴다
  - `FieldBody`는 입력 필드 여러 종류와 에디터가 한 파일에 섞여 있어서 P1-10의 번들 분리를 막는다
- **권장 방향**: `ApplicantRow` 컴포넌트 하나로 반응형을 처리하고, `FieldBody`는 필드 종류별 모듈로 나눈다. 대략적인 기준은 파일 300줄, 컴포넌트 하나에 한 가지 책임이다.
- **확인**: 코드 추적
- **백엔드**: 불필요

### P3-9. 디자인 토큰 하드코딩과 깨진 클래스 문자열

- **위치**: `components/Main/MainSearch/*` 등 14개 파일, `BottomNavigation/index.tsx:142`, `common/Chip/BaseChip.tsx:54`, `common/BottomSheet/index.tsx:95`, `SideTeamCard.tsx:151`, `MyPageCard.tsx:75, 79, 87`, `MainCard.tsx:119, 126`
- **문제**
  - 토큰과 값이 같은 hex를 직접 쓴다(`#237BFF` = `blue-70` 7곳 등). `#0E0E0E`처럼 어떤 토큰과도 맞지 않는 값도 있고, `bg-white`와 `black-5`가 섞여 있다
  - 클래스 문자열이 깨진 곳이 있다
    - `w-[4.8]`: 단위가 없어 너비가 적용되지 않는다
    - `${iconColorClass}shrink-0`: 공백이 없어 선택된 칩의 색과 `shrink-0`이 둘 다 빠진다
    - `rounded-t-[2.4em]`: rem이 아니라 em이다
    - 조건식 결과로 `true`, `false`, `undefined`가 클래스에 그대로 들어간다
- **권장 방향**: `clsx`/`tailwind-merge` 기반의 `cn()` 유틸을 쓰고, `eslint-plugin-tailwindcss`로 임의 색상 값을 막는다.
- **확인**: 코드 추적
- **백엔드**: 불필요

### P3-10. 중복 컴포넌트와 서로 어긋난 스킬 목록

- **위치**: `Modal/DecisionModal.tsx`, `TeamDeleteModal.tsx`, `TeamStatusModal.tsx`, `constants/skillMap.ts`, `components/Main/MainSearch/skill-data.ts`, `constants/positionSkill.ts`, `SideTeamCard.tsx:45-71`, `JobSelectList.tsx:1`
- **문제**
  - 확인 모달 세 개가 거의 같다
  - 바깥 클릭 감지가 네 곳에 따로 구현되어 있다
  - 포지션 라벨 변환이 `utils/position.ts` 말고도 두 곳에 더 있다
  - 스킬 목록이 세 벌이고 내용이 다르다. 검색 필터에는 `XD`, `Flutter`가 있지만 프로필 스킬 목록에는 없다
  - 알림 배지가 100일 때 `100`, 그 위로는 `100+`로 표시된다
- **영향**: 사용자가 XD나 Flutter로 검색은 할 수 있지만, 자기 프로필에는 그 스킬을 추가할 수 없다.
- **권장 방향**: 스킬과 포지션은 한 곳에서 관리한다. 가능하면 서버의 enum이나 API를 기준으로 삼는다. 확인 모달은 P1-3의 `ConfirmDialog` 하나로 합친다. 배지 상한은 `99+`로 한다.
- **확인**: 코드 추적 (목록 diff)
- **백엔드**: 불필요. 서버 기준 일원화는 [서버와 함께 처리할 백로그](backlog-with-backend.md) S8

### P3-11. 사이드바 접힘 상태의 로그인 아이콘 무동작, 팀 메뉴 닫힘 오류

- **위치**: `components/Sidebar/index.tsx:91-99`, `components/Sidebar/SidebarIcon.tsx:47-83`
- **문제**
  - 사이드바를 접은 상태에서 로그아웃 사용자에게 로그인 아이콘을 보여 주지만, 핸들러는 `if (!isProfileVisible) return;`으로 바로 끝난다
  - 팀 메뉴의 트리거 버튼이 바깥 클릭 판정 영역 밖에 있다. 버튼을 누르면 mousedown에서 메뉴가 닫히고, 이어지는 click에서 다시 열린다. 그래서 버튼으로는 메뉴를 닫을 수 없다
  - `<button>` 안에 `<button>`이 들어 있다
- **권장 방향**: 로그아웃 상태에서는 로그인 모달을 연다. 메뉴는 P2-7의 헤드리스 메뉴 부품으로 바꾼다.
- **확인**: 코드 추적
- **백엔드**: 불필요

### P3-12. BottomSheet 포커스 점프, 모달 간 `body.overflow` 충돌

- **위치**: `components/common/BottomSheet/index.tsx:25-71`, `hooks/useModal.ts:45-52`
- **문제**
  - 포커스 트랩 effect가 `[isOpen, onClose]`에 의존하는데, 호출하는 쪽이 모두 인라인 함수를 넘긴다. 필터 칩을 하나 고를 때마다 포커스가 첫 탭으로 돌아간다
  - 모달과 시트가 각자 `body.style.overflow`를 설정하고 되돌린다. 하나를 닫으면 아직 열려 있는 다른 오버레이 뒤에서 페이지가 스크롤된다
- **권장 방향**: `onClose`는 최신 값을 ref로 참조하게 바꾸고, 스크롤 잠금은 몇 개가 열려 있는지 세는 공통 훅으로 만든다. P2-7의 헤드리스 다이얼로그를 도입하면 함께 해결된다.
- **확인**: 코드 추적
- **백엔드**: 불필요

### P3-13. 이미지 오류 상태가 대상이 바뀌어도 초기화되지 않음

- **위치**: `components/Message/ChatArea.tsx:16` (`MessagePage.tsx:36`에서 `key` 없이 재사용), `components/Profile/ProfileImageUpload.tsx:16`, `pages/TeamHomePage.tsx:58`
- **문제**: `imgError` 상태가 대화 상대, 업로드한 이미지, 팀이 바뀌어도 그대로 남는다.
- **영향**: A의 프로필 이미지가 실패한 뒤 B와의 대화로 옮기면, 정상인 B의 이미지도 보이지 않는다.
- **권장 방향**: 대상 ID를 `key`로 주거나, 오류 상태를 `src` 기준으로 관리하는 공통 `<Avatar>`를 만든다.
- **확인**: 코드 추적
- **백엔드**: 불필요

### P3-14. 모집글 본문 이미지의 호스트 제한이 없음

- **위치**: `components/Field/markdownExtensions.ts:60-66`
- **문제**: 본문 이미지에 http와 외부 호스트를 모두 허용한다.
- **영향**: 외부 이미지가 조회자의 IP를 수집하는 트래킹 픽셀로 쓰일 수 있고, http 이미지는 혼합 콘텐츠 경고를 낸다.
- **권장 방향**: 본문 이미지는 자체 S3/CDN 호스트만 허용한다. 허용할 주소는 서버가 이미지 업로드 때 돌려주는 `objectUrl`의 앞부분이다. 서버 환경 변수 `S3_BASE_URL`(운영은 `waggle-server` 버킷의 `prod/` 경로)로 정해지며 웹 저장소에는 없으므로, 서버 개발자에게 받거나 이미 올라간 본문 이미지 주소에서 확인해 `VITE_BASE_URL`처럼 환경 변수로 둔다. 웹에서 본문에 이미지를 넣는 경로는 이미지 버튼의 S3 업로드(`FieldBody`)뿐이고 붙여넣기는 텍스트만 넣으므로, 막아도 사용자가 잃는 기능이 없다. 외부 이미지는 API를 직접 호출해 저장한 본문으로만 들어온다.
- **확인**: 코드 추적
- **백엔드**: 불필요

### P3-15. 댓글 바이트 제한과 에디터 값 동기화가 입력 내용을 되돌리거나 지움

- **위치**: `components/Comment/index.tsx:41, 61-69`, `components/Field/FieldBody.tsx:388-424`
- **문제**
  - 댓글 입력은 제한을 넘으면 `lastValidValue.current`로 되돌리는데, 제출 후 `reset()`이 이 ref를 비우지 않는다. 그래서 제출한 뒤 긴 텍스트를 붙여 넣으면 직전에 쓴 댓글이 다시 나타난다
  - 에디터는 공백만 있는 내용을 `''`로 올려 보내고, 동기화 effect가 이를 다시 `setContent('')`로 적용한다. 이때 커서가 끝으로 튀고, 제한을 넘는 붙여넣기는 통째로 거부된다
- **권장 방향**: 제어 컴포넌트로 바꾸고, 제한을 넘으면 바이트 경계에서 잘라 낸다. 바이트 계산은 공통 유틸 하나로 둔다(현재 900, 7000, 1500, 600 등 제한값이 파일마다 흩어져 있다).
- **확인**: 코드 추적
- **백엔드**: 불필요

### P3-16. GA 첫 페이지뷰 중복 집계

- **위치**: `lib/ga.ts:7-9`, `hooks/usePageTracking.ts`, `hooks/useSearchFilters.ts:64, 73`
- **문제**
  - `ReactGA.initialize`가 `send_page_view: false` 없이 호출되어 자동 page_view가 한 번 나가고, `usePageTracking`이 마운트될 때 한 번 더 보낸다. GA4 향상된 측정의 "브라우저 기록 기반 페이지 변경"이 켜져 있으면 페이지 이동도 두 번 집계된다
  - `trackEvent`를 setState 업데이터 안에서 부른다. StrictMode 개발 환경에서는 이벤트가 두 번 나간다
  - `setUserProperties`는 정의만 되어 있고 어디서도 부르지 않는다
- **권장 방향**: `gtagOptions: { send_page_view: false }`로 수동 집계만 남기고, 이벤트 호출은 업데이터 밖으로 옮긴다.
- **확인**: 코드 추적 (react-ga4 소스 확인)
- **백엔드**: 불필요

### P3-17. 쓰이지 않는 코드, 선언되지 않은 의존성, 템플릿 그대로인 README

- **위치**
  - `hooks/useAuth.ts`의 `usePostRefresh`, `lib/ga.ts`의 `setUserProperties`
  - `components/Sidebar/SidebarItem.tsx:3`: `framer-motion`을 import하지만 `package.json`에는 `motion`만 선언되어 있다. 전이 의존성에 기대는 상태다
  - `console.log`, `console.error` 22곳: 운영 환경의 오류 처리 대신 쓰이고 있다
  - `README.md`: Vite 템플릿 그대로다. 실행 방법, 환경 변수(`VITE_BASE_URL`, `VITE_WS_URL`, `VITE_GA_MEASUREMENT_ID`, `VITE_KAKAO_JS_KEY`), 배포 구조가 문서화되어 있지 않다
  - `TeamHomePage.tsx:110-119`의 TODO가 아무것도 하지 않고 반환한다
- **권장 방향**: 쓰지 않는 코드는 지우고, `framer-motion` import는 `motion/react`로 바꾼다(P1-10에서 제거한다면 생략). README에 개발 환경 설정을 적고 `.env.example`을 추가한다.
- **확인**: 코드 추적
- **백엔드**: 불필요

### P3-18. Kakao SDK SRI 해시와 CSP

- **위치**: `lib/kakao.ts`
- **현황**: 버전을 고정하고, HTTPS, `integrity`, `crossOrigin`을 지정해 필요할 때만 불러온다. 이 부분은 잘 되어 있다.
- **남은 것**
  - `integrity` 값이 Kakao가 공개한 2.8.3 해시와 같은지 확인해야 한다. 다르면 공유 기능이 아무 오류 없이 동작하지 않는다
  - 로드 promise에 타임아웃이 없다
  - CloudFront 응답 헤더에 CSP(`script-src`에 kakaocdn, googletagmanager 허용)가 있는지 확인할 것
