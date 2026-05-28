import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MainCard from '../components/common/Cards/MainCard/MainCard';
import PostEmptyPage from '../components/common/empty/PostEmptyPage';
import { usePostsInfinite } from '../hooks/usePost';
import type { PostsSort } from '../types/api/posts';
import { useGetIsUserProfileComplete } from '../hooks/useUser';
import { useGetTerms } from '../hooks/useTerms';

import MainSearch from '../components/Main/MainSearch/MainSearch';
import ProfileModal from '../components/Modal/ProfileModal';
import LoginModal from '../components/Modal/LoginModal';
import TermsModal from '../components/Modal/TermsModal';

import { formatPostListCreatedAt } from '../utils/kst-time';
import type { PostDetailResponse } from '../types/api/posts';
import { useAuthStore } from '../stores/authStore';
import { trackEvent } from '../lib/ga';

import IcBannerCircle from '../assets/icons/image/ic_character_banner_circle.svg?react';
import IcBannerSquare from '../assets/icons/image/ic_character_banner_square.svg?react';
import IcBannerTriangle from '../assets/icons/image/ic_character_banner_triangle.svg?react';
import SEO from '../components/seo';

/**
 *
 * Main Page
 * : 홈이 되는 화면
 * : 1980px 제작, 1440px 미제작
 *
 */

type AppliedSearchFilters = {
  q: string;
  positions: string[];
  skills: string[];
};

const MainPage = () => {
  const navigate = useNavigate();

  const [sort, setSort] = useState<PostsSort>('NEWEST');
  const [appliedFilters, setAppliedFilters] = useState<AppliedSearchFilters>({
    q: '',
    positions: [],
    skills: [],
  });

  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = usePostsInfinite({
    q: appliedFilters.q,
    positions: appliedFilters.positions,
    skills: appliedFilters.skills,
    sort,
  });

  const { accessToken } = useAuthStore();
  const isLoggedIn = !!accessToken;
  const { data: profileData, isSuccess: isProfileSuccess } =
    useGetIsUserProfileComplete();

  const isOnboardingModalOpen =
    isLoggedIn && isProfileSuccess && !profileData?.complete;
  const isProfileComplete =
    isLoggedIn && isProfileSuccess && !!profileData?.complete;
  const { data: termsData = [], isSuccess: isTermsSuccess } = useGetTerms({
    enabled: isProfileComplete,
  });
  const hasRequiredTermsToAgree = termsData.some(
    ({ mandatory, agreed }) => mandatory && !agreed,
  );
  const isTermsModalOpen =
    isProfileComplete && isTermsSuccess && hasRequiredTermsToAgree;

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const posts = useMemo<PostDetailResponse[]>(() => {
    const pages = postsData?.pages ?? [];
    return pages.flatMap((p) => p?.data ?? []);
  }, [postsData]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        if (!hasNextPage) return;
        if (isFetchingNextPage) return;

        fetchNextPage();
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0,
      },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <>
      <SEO
        title="사이드 프로젝트 팀원 찾기는 와글에서!"
        description="사이드 프로젝트·창업·스터디 팀원을 가장 쉽게 찾는 곳. 직무와 스킬로 매칭하고, 모집글을 올리고, 바로 지원하세요. 개발자·디자이너·기획자 팀빌딩은 와글에서."
      />
      <div className="flex w-full justify-center">
        <div className="flex w-full max-w-[152.6rem] flex-col gap-[5.6rem] px-[4.8rem] pt-[5.4rem]">
          <div className="relative aspect-[763/177] w-full self-stretch overflow-hidden rounded-[2.4rem] bg-blue-60 [container-type:inline-size]">
            {/** 문구 */}
            <div className="pl-[4.476cqw] pt-[4.476cqw]">
              <p className="font-mulmaru text-[4.799cqw] font-[500] text-black-5">
                나랑 같이 사.프하러
              </p>
              <p className="font-mulmaru text-[4.799cqw] font-[500] text-black-5">
                가지 않을래?
              </p>
            </div>
            {/** 캐릭터 이미지 */}
            <div className="absolute bottom-[2.72cqw] right-[5.178cqw] z-10 flex items-end gap-[1.663cqw]">
              <IcBannerCircle className="h-[7.94cqw] w-[7.94cqw]" />
              <IcBannerTriangle className="h-[7.94cqw] w-[7.94cqw]" />
              <IcBannerSquare className="h-[7.94cqw] w-[7.94cqw]" />
            </div>
            {/** 하단 색상 바 */}
            <div className="absolute bottom-0 h-[4.019cqw] w-full bg-blue-50" />
          </div>

          <div className="flex w-full flex-col items-start gap-[2rem]">
            <MainSearch
              sort={sort}
              onChangeSort={setSort}
              onApplyFilters={setAppliedFilters}
            />
          </div>

          {!isLoading && posts.length === 0 ? (
            <PostEmptyPage
              className="max-1440:h-[45.6rem] max-1440:max-w-[104.8rem]"
              title="등록된 모집글이 없습니다."
              subTitle="새로운 팀원을 찾아보세요!"
              btnText="모집글 작성"
              onBtnClick={() =>
                isLoggedIn ? navigate('/post/new') : setIsLoginModalOpen(true)
              }
            />
          ) : (
            <div className="inline-grid w-full max-w-[152.6rem] auto-rows-max grid-cols-[repeat(auto-fill,minmax(33.6rem,1fr))] gap-x-[1.8rem] gap-y-[1.8rem] max-1440:max-w-full">
              {posts.map((post: PostDetailResponse) => {
                const positionList: string[] = Array.from(
                  new Set(
                    post.recruitments.map((r) => r.position).filter(Boolean),
                  ),
                );

                const skillsList: string[] = Array.from(
                  new Set(
                    post.recruitments.flatMap((r) =>
                      (r.skills ?? []).map((s) => s.trim()).filter(Boolean),
                    ),
                  ),
                );

                const createdAtText = post.createdAt
                  ? formatPostListCreatedAt(post.createdAt)
                  : '';

                return (
                  <MainCard
                    key={post.id}
                    mainCardTitle={post.title}
                    mainCardPositions={positionList}
                    mainCardSkills={skillsList}
                    mainCardCreatedAt={createdAtText}
                    isClosed={!post.recruiting}
                    onClick={() => {
                      trackEvent({
                        action: 'click_post',
                        label: post.title,
                        post_id: String(post.id),
                      });
                      navigate(`/post/${post.id}`);
                    }}
                  />
                );
              })}
            </div>
          )}

          <div ref={sentinelRef} className="h-[1px] w-full" />
        </div>
      </div>

      <ProfileModal
        isOpen={isOnboardingModalOpen}
        onClose={() => {}}
        mode="onboarding"
      />
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => {}}
        terms={termsData}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default MainPage;
