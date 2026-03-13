import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import IcCharacterNoPost from '../assets/icons/ic_character_main_page.svg?react';

import MainCard from '../components/common/Cards/MainCard/MainCard';
import { usePostsInfinite } from '../hooks/usePost';
import type { PostsSort } from '../types/api/posts';
import { useGetIsUserProfileComplete } from '../hooks/useUser';

import MainSearch from '../components/Main/MainSearch/MainSearch';
import OnboardingModal from '../components/Modal/OnboardingModal';
import BaseButton from '../components/common/Button';

import { formatPostListCreatedAt } from '../utils/kst-time';
import type { PostDetailResponse } from '../types/api/posts';
import { useAuthStore } from '../stores/authStore';

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
    isError,
  } = usePostsInfinite({
    q: appliedFilters.q,
    positions: appliedFilters.positions,
    skills: appliedFilters.skills,
    sort,
  });

  const { data, isSuccess } = useGetIsUserProfileComplete();
  const { setProfileComplete } = useAuthStore();
  const isOnboardingModalOpen = data?.isComplete === false;

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

  useEffect(() => {
    if (isSuccess && data !== undefined) {
      setProfileComplete(data?.isComplete);
    }
  }, [data, isSuccess, setProfileComplete]);

  const nowMs = Date.now();

  return (
    <>
      <div className="flex w-full justify-center">
        <div className="flex w-full max-w-[152.6rem] flex-col gap-[5.6rem] px-[4.8rem]">
          <div className="flex w-full flex-col items-start gap-[2rem]">
            <MainSearch
              sort={sort}
              onChangeSort={setSort}
              onApplyFilters={setAppliedFilters}
            />
          </div>

          {posts.length === 0 ? (
            <div className="flex h-[64rem] w-full max-w-[152.6rem] items-center justify-center max-1440:h-[45.6rem] max-1440:max-w-[104.8rem]">
              <div className="flex w-[25.8rem] flex-col items-center gap-[2.8rem]">
                <div className="flex w-[20rem] flex-col items-center gap-[1.8rem]">
                  <IcCharacterNoPost />
                  <div className="flex flex-col items-center gap-[0.4rem] self-stretch">
                    <span className="text-[2rem] font-[600] leading-[1.5] tracking-[-0.04rem] text-black-90">
                      등록된 모집글이 없습니다.
                    </span>
                    <span className="text-[1.6rem] font-[500] leading-[1.5] tracking-[-0.032rem] text-black-80">
                      새로운 팀원을 찾아보세요!
                    </span>
                  </div>
                </div>
                <BaseButton color="secondary" className="w-full">
                  모집글 작성
                </BaseButton>
              </div>
            </div>
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
                  ? formatPostListCreatedAt(post.createdAt, nowMs)
                  : '';

                return (
                  <MainCard
                    key={post.postId}
                    mainCardTitle={post.title}
                    mainCardPositions={positionList}
                    mainCardSkills={skillsList}
                    mainCardCreatedAt={createdAtText}
                    onClick={() => navigate(`/post/${post.postId}`)}
                  />
                );
              })}
            </div>
          )}

          <div ref={sentinelRef} className="h-[1px] w-full" />
        </div>
      </div>

      <OnboardingModal isOpen={isOnboardingModalOpen} onClose={() => {}} />
    </>
  );
};

export default MainPage;
