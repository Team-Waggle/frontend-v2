import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MainCard from '../components/common/Cards/MainCard/MainCard';
import PostEmptyPage from '../components/common/empty/PostEmptyPage';
import { usePostsInfinite } from '../hooks/usePost';
import type { PostsSort } from '../types/api/posts';
import { useGetIsUserProfileComplete } from '../hooks/useUser';

import MainSearch from '../components/Main/MainSearch/MainSearch';
import ProfileModal from '../components/Modal/ProfileModal';
import LoginModal from '../components/Modal/LoginModal';

import { formatPostListCreatedAt } from '../utils/kst-time';
import type { PostDetailResponse } from '../types/api/posts';
import { useAuthStore } from '../stores/authStore';

import IcBannerCircle from '../assets/icons/image/ic_character_banner_circle.svg?react';
import IcBannerSquare from '../assets/icons/image/ic_character_banner_square.svg?react';
import IcBannerTriangle from '../assets/icons/image/ic_character_banner_triangle.svg?react';

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

  const { accessToken } = useAuthStore();
  const isLoggedIn = !!accessToken;
  const { data: profileData, isSuccess } = useGetIsUserProfileComplete();

  const isOnboardingModalOpen =
    isLoggedIn && isSuccess && profileData?.isComplete === false;

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
      <div className="flex w-full justify-center">
        <div className="@container flex w-full max-w-[152.6rem] flex-col gap-[5.6rem] px-[4.8rem] pt-[5.4rem]">
          <div className="relative h-[35.4rem] max-w-[152.6rem] self-stretch overflow-hidden rounded-[2.4rem] bg-blue-60">
            {/** 문구 */}
            <div className="pl-[6.4rem] pt-[6.4rem]">
              <p className="text-black-5 text-[6.863rem] font-[500] font-mulmaru">나랑 같이 사.프하러</p>
              <p className="text-black-5 text-[6.863rem] font-[500] font-mulmaru">가지 않을래?</p>
            </div>
            {/** 캐릭터 이미지 */}
            <div className="absolute max-w-[152.6rem] h-[7.4rem] bottom-[3.89rem] right-[7.4047rem] z-10 flex items-end gap-[2.3782rem]">
              <IcBannerCircle />
              <IcBannerTriangle />
              <IcBannerSquare />
            </div>
            {/** 하단 색상 바 */}
            <div className="absolute bottom-0 h-[5.7478rem] w-full bg-blue-50" />
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
            <div className="inline-grid w-full auto-rows-max grid-cols-1 gap-x-[1.8rem] gap-y-[1.8rem] @[50rem]:grid-cols-2 @[75rem]:grid-cols-3 @[130rem]:grid-cols-4">
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
                    key={post.postId}
                    mainCardTitle={post.title}
                    mainCardPositions={positionList}
                    mainCardSkills={skillsList}
                    mainCardCreatedAt={createdAtText}
                    isClosed={!post.isRecruiting}
                    onClick={() => navigate(`/post/${post.postId}`)}
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
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default MainPage;
