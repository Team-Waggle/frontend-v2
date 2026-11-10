# Waggle SEO 전략 검토 보고서 (v2)

**작성일**: 2026-09-02
**대상**: 프론트엔드팀, 기획/마케팅팀
**검토 방식**: 레포지토리 코드 전수 대조 기반 독립 감사 + 프로덕션 HTTP 실측(9절)
**대상 커밋 기준**: `origin/main` (pull 직후)

---

## 0. 이 문서의 관점

본 검토는 "SSR로 갈지 말지"를 다시 논하지 않습니다. 그 질문은 렌더링 방식의 선택지일 뿐이고, 현재 사이트의 실제 SEO 병목은 렌더링 방식이 아니라 **계층별로 흩어진 구체적 결함**에 있습니다. 따라서 SEO를 5개 계층으로 분해하여, 각 계층에서 코드로 확인된 사실과 그 영향, 처방을 제시합니다.

- 1계층 — 렌더링/전달 (봇이 콘텐츠를 어떤 형태로 받는가)
- 2계층 — 크롤링/인덱싱 (봇이 무엇을 읽도록 허용/안내받는가)
- 3계층 — 메타데이터/구조화 데이터 (읽은 것을 어떻게 해석하는가)
- 4계층 — 시맨틱/콘텐츠 (페이지 자체의 주제 신호)
- 5계층 — 성능/Core Web Vitals (경험 신호)

각 항목의 심각도는 **P0(전환·노출을 직접 훼손) / P1(상당한 기회 손실) / P2(개선 여지)** 로 표기합니다.

---

## 1. 요약 (TL;DR)

1. 기본기는 이미 상당 수준으로 갖춰져 있습니다. `html lang="ko"`, viewport, `robots.txt`, `sitemap`, 페이지별 메타 컴포넌트, GA4 이벤트 추적, 라우트 단위 코드 스플리팅, `font-display: swap` 까지 코드에 존재합니다.
2. **전달 계층은 정상입니다 — 프로덕션에 봇용 prerender 계층이 이미 동작 중입니다.** 실측(2026-09-02) 결과 `facebookexternalhit`·`Googlebot` User-Agent 모두 `/post/1` 에서 홈 카드가 아니라 **해당 모집글의 실제 제목·설명**을 받았습니다(9절 실측 로그). 저장소에 prerender 코드가 없는 것은 이 처리가 배포/엣지 계층에 있기 때문입니다. 따라서 SPA 임에도 소셜/검색 봇은 상세 메타를 정상 수신합니다.
3. **따라서 남은 과제는 "전달"이 아니라 "코드 레벨 메타 완성도"입니다.** prerender 가 `src/components/seo.tsx` 출력을 그대로 실어 나르므로, 지금 봇이 받는 카드에는 코드의 결함이 그대로 노출됩니다 — `og:image` 는 페이지 불문 기본 이미지, `og:type` 은 항상 `website`, `twitter:card`·JSON-LD 는 부재. **이 항목들은 코드만 고치면 별도 인프라 작업 없이 즉시 봇에 반영됩니다.**
4. 구조화 데이터(JSON-LD)가 전무합니다. 모집글은 `JobPosting` 스키마에 정확히 들어맞는 콘텐츠인데, 이를 선언하지 않아 구글 리치 결과·구글 채용 검색 노출 자격이 없습니다.
5. 팀 상세 페이지의 메타가 사실상 비어 있고(제목만 전달), 홈/모집글/팀 간 canonical·OG 처리 정책이 일관되지 않습니다.
6. **Soft 404 확정** — `/post/99999999` 같은 부재 URL이 `200 text/html`(SPA 셸)을 반환합니다(9절 실측). 색인 품질·크롤 예산에 악영향.
7. `sitemap.xml` 이 손으로 관리되는 정적 파일이라 **콘텐츠가 늘어도 반영되지 않습니다**(현재 `post/1`~`post/29` 하드코딩, 팀·프로필 URL 부재, `lastmod` 전부 동일 날짜).

**권장 처리 순서: 3·4번(코드 레벨 메타/구조화 — prerender 가 이미 실어 나르므로 ROI 최상) → 6번(Soft 404) → 5번(팀 메타) → 7번(사이트맵 자동화).** 전면 SSR 마이그레이션은 어느 항목에도 필요하지 않습니다.

---

## 2. 1계층 — 렌더링/전달 진단

### 2.1 현재 렌더링 파이프라인 (코드 + 실측)

- 진입점 `index.html` 은 정적 셸이며, `#root` 에 `src/main.tsx` 가 클라이언트에서 마운트됩니다. (`index.html`, `src/main.tsx`)
- 라우팅은 `createBrowserRouter` 기반 클라이언트 라우팅이고, 페이지는 `React.lazy` 로 방문 시점에 로드됩니다. (`src/router.tsx`)
- 페이지별 메타는 `SEO` 컴포넌트가 `react-helmet-async` 의 `<Helmet>` 으로 런타임에 `<head>` 를 갱신합니다. (`src/components/seo.tsx`, `HelmetProvider` 는 `src/main.tsx:68`)
- **저장소에는 prerender 코드가 없지만, 프로덕션 배포/엣지 계층에 봇용 prerender 가 실재합니다.** 실측(9절)에서 봇 User-Agent 요청이 렌더링된 상세 메타를 받았습니다. 즉 클라이언트 렌더링 SPA + 봇 전용 prerender 조합입니다.

### 2.2 이 구조가 봇 유형별로 갖는 의미 (실측 반영)

| 소비 주체 | 받는 것 | 상태 |
|---|---|---|
| Googlebot / Bingbot | prerender 된 상세 HTML(실제 제목·설명·본문) | ✅ 정상 (실측 확인) |
| 소셜/메신저 봇 (카카오톡·페북·X·슬랙·디스코드) | prerender 된 상세 OG 태그 | ✅ 정상 (facebookexternalhit 실측 확인) |

### 2.3 전달 계층 결론 — 정상

**실측 근거**: `curl -A "facebookexternalhit/1.1" https://waggle.lol/post/1` 및 `Googlebot/2.1` 요청 모두 `og:title` 로 **해당 모집글 제목**("사이드 프로젝트 매칭 서비스 와글, 정식 런칭과 함께 할 팀원을 찾습니다"), `og:description` 으로 **모집글 본문 발췌**를 반환합니다. 홈 카드가 아닙니다(전체 로그 9절).

prerender 계층이 소셜 카드·검색 크롤을 이미 커버하므로, 전면 SSR 마이그레이션도 별도 prerender 도입도 필요하지 않습니다.

**단, prerender 는 `seo.tsx` 출력을 그대로 실어 나르므로, 코드 레벨 결함이 봇 카드에 그대로 노출됩니다**:

| 봇이 실제로 받은 값 | 문제 | 근거 |
|---|---|---|
| `og:image` = `https://waggle.lol/og_image.png` | 모집글이어도 사이트 공통 이미지 → 페이지별 차등화 안 됨 | `PostDetailPage.tsx:162` 가 `image` 미전달 |
| `og:type` = `website` | 모집글은 `article` 이 적합 | `seo.tsx:34` 고정값 |
| `twitter:*` 태그 없음 | X 대형 카드 미보장 | `seo.tsx` 미선언 |
| JSON-LD 없음 | 리치 결과 자격 없음 | 전수 검색 0건 |

**핵심 시사점**: 이 결함들은 prerender 가 이미 코드 출력을 실어 나르므로, **`seo.tsx` 및 각 페이지의 `SEO` 호출부만 수정하면 즉시 봇 카드에 반영**됩니다. 인프라 변경 없이 코드 레벨에서 끝나는 작업입니다(3·4절). 직전에 논의된 "페이지별 OG 이미지 차등화"도 이제 순수 코드 작업입니다 — `image` prop 만 넘기면 됩니다.

---

## 3. 2계층 — 크롤링/인덱싱 진단

### 3.1 `robots.txt` (P2, 단 정책 결정 1건 필요)

**근거**: `public/robots.txt` 존재. 비공개 경로(`/post/new`, `/team/*/edit`, `/team/*/applicants` 등)를 적절히 `Disallow` 하고 `Sitemap` 을 선언. 전반적으로 양호합니다.

**검토 필요 1건 — 프로필 인덱싱 차단**: `Disallow: /profile` 은 접두 매칭이므로 개별 사용자 프로필(`/profile/:userId`)까지 전부 크롤을 차단합니다. 개발자/디자이너 프로필은 그 자체로 검색 유입 자산이 될 수 있는 콘텐츠입니다. **"프라이버시 우선(현행 유지)" vs "공개 프로필을 인덱싱 자산화" 는 기획 결정 사항**입니다. 후자를 택한다면 공개 프로필만 허용하도록 규칙을 세분화해야 합니다.

### 3.2 `sitemap.xml` — 정적·수작업 (P1)

**근거**: `public/waggle-sitemap.xml` 은 `https://waggle.lol/post/1`~`/post/29` 를 하드코딩하고, `<lastmod>` 가 전부 `2026-06-01` 로 동일하며, **팀 페이지·프로필 URL이 전혀 없습니다.**

**영향**:
- 30번째 이후 모집글은 사이트맵에 영원히 등재되지 않아 색인 발견이 지연됩니다.
- `lastmod` 가 실제 수정 시각을 반영하지 않아 크롤 우선순위 신호로 기능하지 못합니다.
- 팀 페이지가 사이트맵에 없어 색인 후보에서 누락됩니다.

**처방**: 빌드 타임 또는 백엔드에서 DB 기준으로 사이트맵을 동적 생성. 최소한 (a) 전체 공개 모집글, (b) 전체 공개 팀, (c) 정책상 허용 시 공개 프로필을 포함하고 `lastmod` 를 실제 갱신 시각으로 채웁니다. 규모가 커지면 sitemap index 로 분할.

### 3.3 Soft 404 — 확정 (P1)

**실측 근거**: `curl -I https://waggle.lol/post/99999999` → **`HTTP/2 200`**, `content-type: text/html`, 1424바이트(SPA 셸). 존재하지 않는 모집글이 정상(200)으로 응답합니다. 라우팅상 `NotFoundPage` 가 그려지더라도(`src/router.tsx:108`) HTTP 상태는 200이라 검색엔진에는 "정상 페이지"로 보입니다.

**영향**: 삭제·부재 모집글 URL이 크롤되면 Soft 404 로 분류되어 색인 품질·사이트 신뢰도·크롤 예산에 악영향. 콘텐츠가 늘고 모집글이 마감/삭제될수록 누적됩니다.

**처방**: 배포(CloudFront + Lambda@Edge) 또는 백엔드에서 부재 리소스에 실제 404(마감·삭제분은 410)를 반환. prerender 계층이 이미 있으므로, 봇 응답 시 백엔드 존재 여부를 확인해 상태 코드를 세팅하는 지점을 같은 계층에 붙이는 것이 자연스럽습니다.

### 3.4 canonical 정책 불일치 (P2)

**근거**: `PostDetailPage` 는 canonical 을 설정(`src/pages/PostDetailPage.tsx:166`)하지만, `MainPage`(`src/pages/MainPage.tsx:117`)와 `TeamHomePage`(`src/pages/TeamHomePage.tsx:149`)는 canonical 을 설정하지 않습니다.

**처방**: 전 페이지 자기참조 canonical 을 원칙으로 통일. 쿼리스트링(필터·정렬)이 붙는 목록/홈에서 특히 중복 인덱싱 방지에 유효합니다.

---

## 4. 3계층 — 메타데이터/구조화 데이터 진단

### 4.1 구조화 데이터(JSON-LD) 전무 (P1)

**근거**: 저장소 전체에서 `application/ld+json`, `JobPosting`, `Organization` 검색 결과 0건.

**영향**: 모집글은 `JobPosting` 스키마에 자연스럽게 대응되는 콘텐츠(직무·필요 스킬·기간 등)임에도 이를 선언하지 않아, 구글 리치 결과 및 구글 잡(Job) 관련 노출 자격이 없습니다. 도메인 신뢰 신호(`Organization`), 목록 탐색성(`BreadcrumbList`)도 미구현.

**처방**: 모집글 상세에 `JobPosting`(또는 서비스 성격에 맞춰 `Organization`+커스텀), 사이트 전역에 `Organization`, 상세 경로에 `BreadcrumbList` JSON-LD 추가. `SEO` 컴포넌트에서 `<script type="application/ld+json">` 를 렌더하면, 이미 작동 중인 prerender 계층(9.2절)이 그대로 봇에 실어 나릅니다 — 추가 인프라 불필요.

### 4.2 팀 상세 메타 공백 (P1)

**근거**: `src/pages/TeamHomePage.tsx:149` — `<SEO title={teamDetail?.name || ''} />`. description·image·url·canonical 미전달. 이 경우 설명은 `src/components/seo.tsx:11` 의 기본값 `'여기를 눌러 링크를 확인하세요.'` 로 노출됩니다.

**영향**: 팀 페이지가 검색·공유에서 무의미한 기본 설명으로 표시됩니다.

**처방**: 팀 소개·모집 현황을 반영한 description, 팀 대표 이미지 기반 OG image, url·canonical 을 `PostDetailPage` 수준으로 채웁니다.

### 4.3 Twitter Card 미선언 (P2)

**근거**: `index.html`·`seo.tsx` 모두 `twitter:card` 없음(전수 검색 0건).

**영향**: X 공유 시 대형 이미지 카드가 보장되지 않고 폴백에 의존.

**처방**: `twitter:card=summary_large_image` 와 `twitter:title/description/image` 를 `SEO` 컴포넌트에 추가.

### 4.4 OG 이미지 페이지별 차등화 미적용 (P2)

**근거**: `src/pages/PostDetailPage.tsx:162` 의 `SEO` 는 `image` 를 전달하지 않아 `seo.tsx:13` 의 사이트 공통 `og_image.png` 로 폴백됩니다.

**영향(정확한 분류)**: 이는 검색 랭킹 요소가 아니라 **소셜 공유 전환율(CTR) 최적화** 항목입니다. 모집글은 직무·스킬을, 팀은 팀 아이덴티티를 담은 카드가 클릭률을 높입니다. 단 2.3 의 전달 계층이 선행되어야 실효가 있습니다.

**처방**: 상세 페이지에 페이지 맥락을 반영한 OG image URL 전달(동적 OG 이미지 생성 또는 콘텐츠 기반 정적 매핑).

### 4.5 `og:type` 부정확 (P2)

**근거**: `src/components/seo.tsx:34` 이 전 페이지에서 `og:type=website` 고정. 모집글 상세는 의미상 `article` 이 적합합니다.

---

## 5. 4계층 — 시맨틱/콘텐츠 진단

### 5.1 홈페이지 h1 부재 (P1)

**근거**: `src/pages/MainPage.tsx` 에 `<h1>`~`<h3>` 및 landmark(`role`/`aria-`) 가 하나도 없습니다(전수 검색 0건). 반면 모집글 상세는 제목을 `<h1>` 로 정확히 사용합니다(`src/pages/PostDetailPage.tsx:179-181`).

**영향**: 가장 중요한 진입 페이지가 주제를 나타내는 최상위 제목 신호를 제공하지 않습니다. 검색엔진의 주제 파악과 접근성 모두에 불리.

**처방**: 홈에 서비스 핵심 가치를 담은 `<h1>`(예: 브랜드+핵심 카피)을 도입하고, 섹션에 `<h2>` 계층을 부여. 전역적으로 heading 사용이 희소(6개 파일·7개 태그)하므로 시맨틱 구조 보강 여지가 큽니다.

### 5.2 URL에 키워드 신호 없음 (P2)

**근거**: 상세 경로가 숫자 ID 기반(`/post/:postId`, `/team/:teamId`; `src/router.tsx`). 슬러그가 없습니다.

**처방**: `/post/:id/:slug`(제목 슬러그 부가) 형태 도입. 라우팅상 뒤쪽 슬러그는 무시하고 ID 로만 조회하면 백엔드 변경을 최소화할 수 있습니다.

### 5.3 이미지 대체텍스트 (P2, 스팟체크)

**근거**: `alt`/`<img>` 사용이 17개 파일에 분포하여 대체텍스트 관례 자체는 존재. 다만 개별 `alt` 의 서술 품질(장식용 빈 alt vs 정보성 alt 구분)은 본 감사 범위에서 전수 검증하지 않았습니다.

**처방**: 정보성 이미지에는 서술형 alt, 순수 장식 이미지에는 빈 `alt=""` 를 원칙화(간단한 린트 룰로 강제 가능).

---

## 6. 5계층 — 성능/Core Web Vitals 진단

전반적으로 이 계층은 상태가 좋습니다.

| 항목 | 상태 | 근거 |
|---|---|---|
| 라우트 단위 코드 스플리팅 | 양호 | `src/router.tsx` 에서 페이지 `React.lazy` |
| 폰트 로딩 | 양호 | self-host woff2 + `font-display: swap` (`src/styles/global.css:8,14`) |
| GA4/행동 신호 계측 | 양호 | `src/lib/ga.ts` + SPA 경로 변경 추적 `src/hooks/usePageTracking.ts` |

개선 여지(P2):
- **LCP 폰트 preload 부재**: `index.html` 에 대표 폰트 `rel="preload"` 가 없어 초기 텍스트 렌더가 지연될 수 있습니다. Variable 폰트 1종 preload 권장.
- **벤더 청크 전략 부재**: `vite.config.ts` 가 최소 설정으로 `manualChunks` 미지정. Tiptap·STOMP·motion 등 무거운 의존성이 있으나, 이들이 라우트 lazy 청크에 격리되어 홈 초기 로드에 포함되지 않는지 번들 분석으로 확인 권장.
- **중간 뷰포트 대응**: 데스크톱 래퍼가 `min-w-[144rem]` 이고 오버라이드가 `max-sm:`(≈640px 미만) 뿐이라, 640~1439px(태블릿) 구간은 1440px 로 강제되어 가로 스크롤이 발생합니다. 모바일 우선 인덱싱은 스마트폰 뷰포트(≈412px, `max-sm` 적용)를 사용하므로 색인 위험은 낮지만, 태블릿 UX 저하는 실재합니다. (`src/App.tsx:43`)

---

## 7. 우선순위 로드맵

> prerender 계층이 이미 작동 중이므로(9절), 코드 레벨 메타 결함은 `seo.tsx` 수정만으로 곧바로 봇에 반영됩니다. 따라서 "코드만 고치면 봇에 즉시 반영되는" 항목이 최상위 ROI 이며, 전부 FE 작업으로 인프라 변경이 필요 없습니다.

| 우선순위 | 작업 | 계층 | 근거 파일 | 성격 |
|---|---|---|---|---|
| **P1** | 상세 OG 이미지 차등화 (`image` prop 전달) — prerender 가 즉시 실어 나름 | 3 | `PostDetailPage.tsx:162`, `TeamHomePage.tsx:149` | FE |
| **P1** | 모집글 `JobPosting`·전역 `Organization` JSON-LD 추가 | 3 | `seo.tsx`/신규 | FE |
| **P1** | 팀 상세 메타 완성(description/image/url/canonical) | 3 | `TeamHomePage.tsx:149` | FE |
| **P1** | Soft 404 → 실제 404/410 반환 (실측 확정) | 2 | 배포/엣지 계층 | 인프라 |
| P1 | 사이트맵 동적 생성(모집글·팀·프로필, 실제 lastmod) | 2 | `waggle-sitemap.xml` | BE/빌드 |
| P1 | 홈 `<h1>`/시맨틱 heading 도입 | 4 | `MainPage.tsx` | FE |
| P2 | Twitter Card 태그 추가 | 3 | `seo.tsx` | FE |
| P2 | canonical 전 페이지 통일 / `og:type=article` | 2·3 | `seo.tsx`, `MainPage.tsx` | FE |
| P2 | "리디렉션 포함 페이지" 3건 원인 규명(GSC) | 2 | `robots.txt`/배포 | 인프라+FE |
| P2 | URL 슬러그 도입 | 4 | `router.tsx` | FE/BE |
| P2 | 폰트 preload / 벤더 청크 점검 / 태블릿 뷰포트 | 5 | `index.html`, `vite.config.ts`, `App.tsx` | FE |
| 결정 | 프로필 인덱싱 정책(차단 유지 vs 자산화) | 2 | `robots.txt` | 기획 |

상위 3개(OG 이미지·JSON-LD·팀 메타)는 전부 `seo.tsx` 와 각 페이지 `SEO` 호출부 수정만으로 끝나며, 이미 검증된 prerender 파이프라인을 타고 봇에 반영됩니다. 가장 적은 노력으로 가장 큰 소셜/리치 결과 효과를 냅니다.

---

## 8. 성과 측정

| 지표 | 도구 | 비고 |
|---|---|---|
| 색인 페이지 수 / 노출·클릭·CTR | Google Search Console | 사이트맵 자동화 후 색인 증가 추적 |
| 소셜 카드 정상 노출 | 카카오 OG 캐시 초기화 도구, Facebook Sharing Debugger | OG 이미지/타입 수정 배포 직후 캐시 초기화 후 검증 |
| 리치 결과 자격 | Google Rich Results Test | JSON-LD 배포 후 |
| Core Web Vitals (LCP/CLS/INP) | Search Console, Lighthouse | preload·청크 조정 전후 비교 |
| 유입·전환 이벤트 | GA4 (이미 연동) | `src/lib/ga.ts` 이벤트 taxonomy 활용 |

---

## 9. 프로덕션 실측 결과 (2026-09-02)

코드만으로는 단정할 수 없는 인프라 계층 항목을 프로덕션 HTTP 응답으로 실측한 결과입니다. 2·3절 판정의 근거입니다.

### 9.1 정적 리소스 서빙 — 정상

```
$ curl -sI https://waggle.lol/robots.txt
HTTP/2 200 · content-type: text/plain · server: AmazonS3 (via CloudFront)
```
robots.txt·sitemap 모두 SPA 셸이 아닌 실제 파일로 200 서빙. **정상.**

### 9.2 봇 prerender — 정상

```
$ curl -s -A "facebookexternalhit/1.1" https://waggle.lol/post/1 | grep -i "og:\|<title"
<title>사이드 프로젝트 매칭 서비스 와글, 정식 런칭과 함께 할 팀원을 찾습니다</title>
<meta property="og:title" content="사이드 프로젝트 매칭 서비스 와글, ...">
<meta property="og:description" content="와글(Waggle), 어떤 서비스인가요 ...">
<meta property="og:image" content="https://waggle.lol/og_image.png">   ← 기본 이미지(코드 결함)
<meta property="og:type" content="website">                            ← article 아님(코드 결함)
```
`Googlebot/2.1` 도 동일. 봇이 **홈 카드가 아니라 실제 모집글 메타**를 받음 → prerender 계층 실재 확인. 단 `og:image`·`og:type` 은 코드 값 그대로라 4절 결함이 봇에 노출됨. `twitter:*`·JSON-LD 는 응답에 없음.

### 9.3 Soft 404 — 문제 확정

```
$ curl -sI https://waggle.lol/post/99999999
HTTP/2 200 · content-type: text/html · content-length: 1424 (SPA 셸)
```
부재 모집글이 200 반환 → **Soft 404 확정**(3.3절). (`/이런거없음` 의 400 은 S3 URL 인코딩 이슈로 무관.)

### 9.4 Search Console — 등록됨

- 소유권 등록 완료. 색인 생성됨 **13페이지**(6월 ~12 → 8월 ~17 증가 추세).
- 미색인 4페이지: **"리디렉션이 포함된 페이지" 3건**(원인 규명 필요 — 로드맵 P2), "크롤링됨-현재 색인 생성 안 됨" 1건(썸씬 콘텐츠에서 흔함, 방치 가능).

### 9.5 남은 미확인 항목

- 네이버 서치어드바이저 / Bing Webmaster 등록 여부
- prerender 구현체 종류(Prerender.io vs 자체 headless 등) — 동작은 확인됨, 세부는 미확인
- `VITE_GA_MEASUREMENT_ID` 프로덕션 실주입 여부(`src/lib/ga.ts:5`, 미주입 시 GA no-op)

---

**문의**: 본 보고서의 기술 항목은 프론트엔드 담당자에게 문의 바랍니다.
