import { useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useGetPostDetail, usePatchPostClose } from '../hooks/usePost';
import { useGetMyApplications, useGetUserMe } from '../hooks/useUser';
import usePostDetailApplyButtonPosition from '../hooks/usePostDetailApplyButtonPosition';
import usePostDetailFloatingSideCard from '../hooks/usePostDetailFloatingSideCard';

import { SkillIconLarge } from '../utils/SkillIcon';
import { toSkillLabel } from '../utils/skill';
import { formatPostDetailCreatedAt } from '../utils/kst-time';

import IcProfileBasic from '../assets/icons/ic_profile_basic.svg?react';
import IcPersons from '../assets/icons/normal/ic_persons.svg?react';
import IcFolder from '../assets/icons/normal/ic_folder.svg?react';
import ButtonBlur from '../assets/blur/RecruitmentDetail_Button_Blur.svg?react';

import TeamCard from '../components/PostDetail/TeamCard';
import SideTeamCard from '../components/common/Cards/SideTeamCard';
import BaseButton from '../components/common/Button/index';
import { FieldViewer } from '../components/Field/FieldViewer';
import ApplyModal from '../components/Modal/ApplyModal';
import WaitingModal from '../components/Modal/WaitingModal';
import LoginModal from '../components/Modal/LoginModal';

import { useAuthStore } from '../stores/authStore';

type RecruitmentCountKey =
  | 'plan'
  | 'design'
  | 'frontend'
  | 'backend'
  | 'marketing'
  | 'etc';

const getRecruitmentCountKey = (position?: string): RecruitmentCountKey => {
  if (position === 'PM') return 'plan';
  if (position === 'DESIGNER') return 'design';
  if (position === 'FRONTEND') return 'frontend';
  if (position === 'BACKEND') return 'backend';
  if (position === 'MARKETER') return 'marketing';
  return 'etc';
};

const POSITION_ITEMS: Array<{
  key: RecruitmentCountKey;
  label: string;
  noWrap?: boolean;
}> = [
  { key: 'plan', label: '기획' },
  { key: 'design', label: '디자인' },
  { key: 'frontend', label: '프론트엔드', noWrap: true },
  { key: 'backend', label: '백엔드' },
  { key: 'marketing', label: '마케팅' },
  { key: 'etc', label: '기타' },
];

const LABEL_BASE_STYLE =
  'text-[1.4rem] font-[500] leading-[1.5] tracking-[-0.028rem] text-black-100';
const LABEL_NOWRAP_STYLE =
  'text-[1.4rem] font-[500] leading-[1.5] tracking-[-0.028rem] text-black-100 whitespace-nowrap';
const VALUE_STYLE =
  'text-[1.4rem] font-[500] leading-[1.5] tracking-[0.028rem] text-blue-80';

const PostDetailPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  const parsedPostId = useMemo(() => {
    if (!postId) return 0;

    const n = Number(postId);
    if (!Number.isInteger(n) || n <= 0) return 0;

    return n;
  }, [postId]);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isApplyWaitingModalOpen, setIsApplyWaitingModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { accessToken } = useAuthStore();

  const { data: postDetail } = useGetPostDetail(parsedPostId);
  const { data: me } = useGetUserMe();
  const { data: myApplications } = useGetMyApplications();
  const { mutate: patchPostClose, isPending: isClosing } = usePatchPostClose();

  const leftColRef = useRef<HTMLDivElement | null>(null);
  const sideWrapRef = useRef<HTMLDivElement | null>(null);

  const applyButtonPx = usePostDetailApplyButtonPosition(leftColRef);

  usePostDetailFloatingSideCard(leftColRef, sideWrapRef);

  const myApplicationStatus =
    myApplications?.find((app) => app.postId === parsedPostId)?.status ?? null;

  const myUserId = me?.userId;
  const postUserId = postDetail?.user?.userId;

  const isMyPost =
    Boolean(myUserId) && Boolean(postUserId) && myUserId === postUserId;

  const apiCounts = useMemo<Record<RecruitmentCountKey, number>>(() => {
    const counts: Record<RecruitmentCountKey, number> = {
      plan: 0,
      design: 0,
      frontend: 0,
      backend: 0,
      marketing: 0,
      etc: 0,
    };

    for (const recruitment of postDetail?.recruitments ?? []) {
      const positionKey = getRecruitmentCountKey(recruitment.position);
      counts[positionKey] += recruitment.count;
    }

    return counts;
  }, [postDetail]);

  const sortedPositions = useMemo(
    () =>
      [...POSITION_ITEMS].sort(
        (a, b) => (apiCounts[b.key] ? 1 : 0) - (apiCounts[a.key] ? 1 : 0),
      ),
    [apiCounts],
  );

  const postSkills = useMemo(() => {
    const recruitments = postDetail?.recruitments ?? [];

    const mergedSkills = recruitments.flatMap((recruitment) => {
      return recruitment.skills ?? [];
    });

    const uniqueSkills = Array.from(new Set(mergedSkills));

    return uniqueSkills
      .map((skill) => toSkillLabel(skill))
      .filter((skillLabel) => Boolean(skillLabel));
  }, [postDetail?.recruitments]);

  return (
    <>
      <div className="flex flex-1 items-start justify-center gap-[7.2rem] self-stretch pt-[11.2rem]">
        {/** 모집글 상세조회 구간 */}
        <div
          ref={leftColRef}
          className="flex w-[68.8rem] flex-col items-center gap-[6rem]"
        >
          {/** 모집글 상세조회 제목 및 핈수 정보 */}
          <div className="flex flex-col items-start gap-[1rem] self-stretch">
            <div className="flex flex-col items-start gap-[3.2rem] self-stretch">
              <div className="flex flex-col items-start gap-[2rem] self-stretch">
                <div className="overflow-hidden">
                  <h1 className="line-clamp-2 overflow-ellipsis text-[3.4rem] font-[600] leading-[1.5] tracking-[-0.068rem] text-black-100">
                    {postDetail?.title}
                  </h1>
                </div>
                <div className="flex items-center gap-[0.8rem]">
                  <div
                    className="flex cursor-pointer items-center gap-[0.8rem]"
                    onClick={() => {
                      if (postDetail?.user?.userId) {
                        navigate(`/profile/${postDetail.user.userId}`);
                      }
                    }}
                  >
                    {postDetail?.user?.profileImageUrl ? (
                      <div className="shadow-insetBorderBlack10 flex aspect-[1/1] h-[2.4rem] w-[2.4rem] flex-col items-center justify-center gap-[1rem] rounded-[0.6rem] bg-black-10">
                        <img
                          alt={'프로필 이미지'}
                          src={postDetail?.user?.profileImageUrl}
                          className="h-[2.4rem] w-[2.4rem] rounded-[0.6rem] object-cover"
                        />
                      </div>
                    ) : (
                      <IcProfileBasic className="h-[2.4rem] w-[2.4rem]" />
                    )}
                    <span className="text-[1.6rem] font-[600] leading-[1.5] tracking-[-0.032rem] text-black-100">
                      {postDetail?.user?.username}
                    </span>
                  </div>
                  <div className="h-[1.7rem] w-[0.1rem] bg-black-40" />
                  <span className="text-[1.6rem] font-[400] leading-[1.5] tracking-[-0.032rem] text-black-60">
                    {postDetail?.createdAt
                      ? formatPostDetailCreatedAt(postDetail.createdAt)
                      : ''}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between self-stretch">
                {/** 왼쪽: 모집인원 */}
                <div className="flex w-[39.5rem] flex-col items-start gap-[1.6rem] rounded-[0.8rem] border border-solid border-black-30 px-[2.2rem] pb-[2.8rem] pt-[2rem]">
                  <div className="flex items-center gap-[0.4rem]">
                    <IcPersons className="h-[1.6rem] w-[1.6rem] rounded-[0.4rem]" />
                    <span className="text-[1.3rem] font-[600] leading-[1.5] text-black-100">
                      모집 인원
                    </span>
                  </div>
                  <div className="inline-grid h-[6.2rem] gap-x-[48px] gap-y-[2rem] px-[1rem] [grid-template-columns:repeat(3,fit-content(100%))] [grid-template-rows:repeat(2,fit-content(100%))]">
                    {sortedPositions.map((position) => {
                      const count = apiCounts[position.key] ?? 0;

                      return (
                        <div
                          key={position.key}
                          className={`flex items-center gap-[1rem] self-stretch ${count === 0 ? 'invisible' : ''}`}
                        >
                          <span
                            className={
                              position.noWrap
                                ? LABEL_NOWRAP_STYLE
                                : LABEL_BASE_STYLE
                            }
                          >
                            {position.label}
                          </span>
                          <span className={VALUE_STYLE}>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/** 오른쪽: 사용스킬 */}
                <div className="flex h-[14.9rem] w-[27.9rem] flex-col items-start gap-[1.6rem] rounded-[0.8rem] border border-solid border-black-30 px-[2.2rem] pb-[2.8rem] pt-[2rem]">
                  <div className="flex items-center gap-[0.4rem]">
                    <IcFolder className="h-[1.6rem] w-[1.6rem]" />
                    <span className="text-[1.3rem] font-[600] leading-[1.5] tracking-[-0.026rem] text-black-100">
                      사용스킬
                    </span>
                  </div>
                  <div className="inline-grid gap-x-[20px] gap-y-[2rem] self-stretch px-[1rem] [grid-template-columns:repeat(5,minmax(0,1fr))] [grid-template-rows:repeat(2,fit-content(100%))]">
                    {postSkills.map((skill) => (
                      <SkillIconLarge
                        key={skill}
                        name={skill}
                        className="!h-[2.4rem] !w-[2.4rem]"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/** 모집글 상세조회 내용 */}
          <div
            className={[
              'flex flex-col items-start gap-[4rem] self-stretch',
              !isMyPost ? 'mb-[6.6rem]' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <TeamCard
              teamImageUrl={postDetail?.team?.profileImageUrl}
              title={postDetail?.team?.name}
              memberCount={postDetail?.team?.memberCount}
              workMode={postDetail?.team?.workMode}
              createdAt={postDetail?.team?.createdAt}
              description={postDetail?.team?.description}
              onClick={() => {
                if (!postDetail?.team?.teamId) {
                  return;
                }

                navigate(`/team/${postDetail.team.teamId}`);
              }}
            />
            <div className="w-[68.8rem]">
              <FieldViewer content={postDetail?.content} />
            </div>
          </div>

          {/** 작성자 기준 화면: 마감하기, 수정하기 버튼 */}
          {isMyPost && (
            <div className="flex w-[32rem] items-start gap-[1.2rem] pb-[6.6rem] pt-[1.2rem]">
              <BaseButton
                size="lg"
                color="secondary"
                disabled={!postDetail?.isRecruiting || isClosing}
                onClick={() =>
                  patchPostClose({ postId: parsedPostId, status: 'CLOSED' })
                }
              >
                마감하기
              </BaseButton>
              <BaseButton
                size="lg"
                color="primary"
                disabled={!postDetail?.isRecruiting}
                onClick={() => navigate(`/post/${parsedPostId}/edit`)}
              >
                수정하기
              </BaseButton>
            </div>
          )}
        </div>

        {/** 팀 구간 */}
        <div className="flex self-start pt-[12.7rem]">
          <div ref={sideWrapRef} className="self-start will-change-transform">
            <SideTeamCard
              memberId={postDetail?.user?.userId}
              title={postDetail?.user?.username}
              position={postDetail?.user?.position}
              profileImageUrl={postDetail?.user?.profileImageUrl}
              skills={postDetail?.user?.skills}
              variant="post"
              isMe={isMyPost}
            />
          </div>
        </div>

        {/** 지원자 기준 화면: 지원하기 버튼 */}
        {/** 추후 기획에 따라 변경 될 예정 */}
        {!isMyPost &&
          applyButtonPx !== null &&
          postDetail?.isRecruiting &&
          myApplicationStatus !== 'APPROVED' &&
          myApplicationStatus !== 'REJECTED' && (
            <div
              className="fixed bottom-[3.6rem] z-50 -translate-x-1/2"
              style={{ left: applyButtonPx ?? undefined }}
            >
              <div className="relative w-[32rem]">
                <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2">
                  <ButtonBlur className="h-[10rem] w-[40rem]" />
                </div>

                <BaseButton
                  className="relative z-10 w-[32rem]"
                  size="lg"
                  color="primary"
                  disabled={myApplicationStatus === 'PENDING'}
                  onClick={() => {
                    if (!accessToken) {
                      setIsLoginModalOpen(true);
                    } else {
                      setIsApplyModalOpen(true);
                    }
                  }}
                >
                  {myApplicationStatus === 'PENDING'
                    ? '승인 대기중'
                    : '지원하기'}
                </BaseButton>
              </div>
            </div>
          )}
      </div>
      {postDetail && (
        <ApplyModal
          postData={postDetail}
          myData={me}
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          onSuccessApply={() => {
            setIsApplyModalOpen(false);
            setIsApplyWaitingModalOpen(true);
          }}
        />
      )}
      <WaitingModal
        isOpen={isApplyWaitingModalOpen}
        onClose={() => setIsApplyWaitingModalOpen(false)}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default PostDetailPage;
