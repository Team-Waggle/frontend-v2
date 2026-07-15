import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MainCard from '../components/common/Cards/MainCard/MainCard';
import PostEmptyPage from '../components/common/empty/PostEmptyPage';
import { usePostsInfinite } from '../hooks/usePost';
import type { PostsSort } from '../types/api/posts';
import { useGetIsUserProfileComplete } from '../hooks/useUser';
import { useGetTerms } from '../hooks/useTerms';

import MainSearch from '../components/Main/MainSearch/MainSearch';
import MobileSearch from '../components/Main/MobileSearch/MobileSearch';
import ProfileModal from '../components/Modal/ProfileModal';
import LoginModal from '../components/Modal/LoginModal';
import TermsModal from '../components/Modal/TermsModal';

import { formatPostListCreatedAt } from '../utils/kst-time';
import type { PostDetailResponse } from '../types/api/posts';
import { useAuthStore } from '../stores/authStore';
import { trackEvent } from '../lib/ga';
import { useSearchFilters } from '../hooks/useSearchFilters';

import SEO from '../components/seo';

/**
 *
 * Main Page
 * : 홈이 되는 화면
 * : 1980px 제작, 1440px 미제작
 *
 */

const MainPage = () => {
  const navigate = useNavigate();

  const [sort, setSort] = useState<PostsSort>('NEWEST');
  const [appliedFilters, setAppliedFilters] = useState({
    q: '',
    positions: [] as string[],
    skills: [] as string[],
  });

  const searchFilterProps = useSearchFilters({
    onApplyFilters: setAppliedFilters,
    onChangeSort: setSort,
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
      <div className="flex w-full justify-center max-sm:pt-[1rem]">
        <div className="flex w-full max-w-[152.6rem] flex-col gap-[5.6rem] px-[4.8rem] pt-[5.4rem] max-sm:gap-[1.6rem] max-sm:px-[2rem] max-sm:pt-[1rem]">
          <picture className="w-full">
            <source
              media="(max-width: 767px)"
              srcSet="/assets/images/banner/banner_mobile.svg"
            />
            <img
              src="/assets/images/banner/banner_desktop.svg"
              alt="와글 배너"
              className="w-full rounded-[2.4rem]"
            />
          </picture>

          <div className="flex w-full flex-col items-start gap-[2rem]">
            <div className="w-full max-sm:hidden">
              <MainSearch
                sort={sort}
                onChangeSort={setSort}
                {...searchFilterProps}
              />
            </div>
            <div className="hidden w-full max-sm:block">
              <MobileSearch
                sort={sort}
                onChangeSort={setSort}
                {...searchFilterProps}
              />
            </div>
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
            <div className="inline-grid w-full max-w-[152.6rem] auto-rows-max grid-cols-[repeat(auto-fill,minmax(33.6rem,1fr))] gap-x-[1.8rem] gap-y-[1.8rem] max-1440:max-w-full max-sm:grid-cols-[repeat(auto-fill,minmax(32rem,1fr))]">
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
