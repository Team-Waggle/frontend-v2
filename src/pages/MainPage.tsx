import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MainCard from '../components/common/Cards/MainCard/MainCard';
import PostEmptyPage from '../components/common/empty/PostEmptyPage';
import { usePostsInfinite } from '../hooks/usePost';
import type { PostsSort } from '../types/api/posts';
import { useGetIsUserProfileComplete } from '../hooks/useUser';

import MainSearch from '../components/Main/MainSearch/MainSearch';
import OnboardingModal from '../components/Modal/OnboardingModal';
import LoginModal from '../components/Modal/LoginModal';
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
  const { setProfileComplete, isLoggedIn } = useAuthStore();
  const isOnboardingModalOpen = data?.isComplete === false;

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
            <PostEmptyPage className="max-1440:h-[45.6rem] max-1440:max-w-[104.8rem]" title="등록된 모집글이 없습니다." subTitle="새로운 팀원을 찾아보세요!" btnText="모집글 작성" onBtnClick={() => isLoggedIn ? navigate('/post/new') : setIsLoginModalOpen(true)} />
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
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
};

export default MainPage;
