import { useEffect, useMemo, useRef } from 'react';

import MainCard from '../components/common/Cards/MainCard/MainCard';
import { usePostsInfinite } from '../hooks/usePost';
import { useGetIsUserProfileComplete } from '../hooks/useUser';

import MainSearch from '../components/Main/MainSearch/MainSearch';
import OnboardingModal from '../components/Modal/OnboardingModal';

import { formatPostListCreatedAt } from '../utils/kst-time';
import type { PostDetailResponse } from '../types/api/posts';

/**
 *
 * Main Page
 * : 홈이 되는 화면
 * : 1980px 제작, 1440px 미제작
 *
 */

const MainPage = () => {
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = usePostsInfinite();

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

  const { data } = useGetIsUserProfileComplete();
  const isOnboardingModalOpen = data?.isComplete === false;

  const nowMs = Date.now();
  
  return (
    <>
      {/** Main */}
      <div className="flex w-full justify-center">
        {/** Page Container */}
        <div className="flex w-full max-w-[152.6rem] flex-col gap-[5.6rem] px-[4.8rem]">
          {/** Frame 01 */}
          <div className="flex w-full flex-col items-start gap-[2rem]">
            <MainSearch />
          </div>

          {/** Frame 02 */}
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
                />
              );
            })}
          </div>

          <div ref={sentinelRef} className="h-[1px] w-full" />
        </div>
      </div>

      <OnboardingModal isOpen={isOnboardingModalOpen} onClose={() => {}} />
    </>
  );
};

export default MainPage;
