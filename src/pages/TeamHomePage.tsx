import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useHorizontalScroll from '../hooks/useHorizontalScroll';
import {
  useGetTeamPosts,
  useGetTeamDetail,
  useGetTeamMembers,
  useDeleteTeamMember,
  usePatchTeamMemberRole,
} from '../hooks/useTeam';
import { useGetUserMe } from '../hooks/useUser';

import TeamDefaultImg from '../assets/icons/image/ic_character_circle_primary_60.svg?react';

import IcPersons from '../assets/icons/normal/ic_persons.svg?react';
import IcDesktop from '../assets/icons/normal/ic_desktop.svg?react';
import IcCompany from '../assets/icons/normal/ic_company.svg?react';

import ChevronLeft from '../assets/icons/normal/chevron/ic_chevronLeft.svg?react';
import ChevronRight from '../assets/icons/normal/chevron/ic_chevronRight.svg?react';

import TeamNav from '../components/Team/TeamNav';
import MainCard from '../components/common/Cards/MainCard/MainCard';
import SideTeamCard from '../components/common/Cards/SideTeamCard';
import IconWrapper from '../components/common/IconWrapper';
import BaseTag from '../components/common/Tag';
import {
  formatPostListCreatedAt,
  formatTeamCardCreatedAt,
} from '../utils/kst-time';

const TeamHomePage = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();

  const parsedTeamId = useMemo(() => {
    if (!teamId) return 0;

    const n = Number(teamId);
    if (!Number.isInteger(n) || n <= 0) return 0;

    return n;
  }, [teamId]);

  const { data: teamDetail } = useGetTeamDetail(parsedTeamId);
  const { data: teamMembers } = useGetTeamMembers(parsedTeamId);
  const { data: teamApplications } = useGetTeamPosts(parsedTeamId);
  const { data: me } = useGetUserMe();

  const patchTeamMemberRoleMutation = usePatchTeamMemberRole(parsedTeamId);
  const deleteTeamMemberMutation = useDeleteTeamMember(parsedTeamId);

  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [activeTeamMember, setActiveTeamMember] = useState<number | null>(null);

  const applications = teamApplications ?? [];

  const members = teamMembers ?? [];

  const myMember = members.find((member) => member.userId === me?.userId);
  const isLeaderOrManager =
    !myMember?.deletedAt &&
    (myMember?.role === 'LEADER' || myMember?.role === 'MANAGER');

  const sortedMembers = useMemo(() => {
    const visibleMembers = myMember
      ? members
      : members.filter((m) => !m.deletedAt);

    if (!me?.userId) {
      return visibleMembers;
    }

    return [...visibleMembers].sort((a, b) => {
      const aIsMe = a.userId === me.userId ? 1 : 0;
      const bIsMe = b.userId === me.userId ? 1 : 0;
      if (bIsMe !== aIsMe) return bIsMe - aIsMe;

      const aIsDeleted = a.deletedAt ? 1 : 0;
      const bIsDeleted = b.deletedAt ? 1 : 0;
      return aIsDeleted - bIsDeleted;
    });
  }, [members, me?.userId, myMember]);

  const handleAssignManager = (memberId: number) => {
    patchTeamMemberRoleMutation.mutate({
      memberId,
      role: 'MANAGER',
    });
  };

  const activeMemberCount = members.filter((m) => !m.deletedAt).length;

  const handleKickMember = (memberId: number) => {
    const isSelf = memberId === myMember?.memberId;

    if (isSelf) {
      if (activeMemberCount === 1) {
        // TODO: "팀에 혼자 남아 있을 때는 이탈할 수 없습니다." 알림 추가
        return;
      }
      if (myMember?.role === 'LEADER') {
        // TODO: "리더는 다른 팀원에게 리더를 위임한 후 이탈할 수 있습니다." 알림 추가
        return;
      }
    }

    deleteTeamMemberMutation.mutate(memberId);
  };
  const nowMs = useMemo(() => Date.now(), [applications.length]);

  const toWorkModeLabel = (workMode?: string): string => {
    if (workMode === 'ONLINE') {
      return '온라인';
    }

    if (workMode === 'OFFLINE') {
      return '오프라인';
    }

    return workMode ?? '온라인';
  };

  const { trackRef, canScrollLeft, canScrollRight, scrollByItem } =
    useHorizontalScroll({
      itemSelector: '[data-main-card="true"]',
      gapPx: 18,
      deps: [applications.length],
    });

  return (
    <div
      className={[
        'flex flex-1 flex-col items-center gap-[6rem] self-stretch',
        isLeaderOrManager ? 'pt-[5.4rem]' : 'pt-[9.2rem]',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/** pt-[9.2rem] pt-[5.4rem] */}
      {isLeaderOrManager && <TeamNav />}
      <div className="flex w-full max-w-full flex-col items-start gap-[2.4rem] px-[1.6rem] sm:gap-[3.2rem] sm:px-[2.4rem] lg:max-w-[clamp(98.2rem,70vw,130rem)] lg:gap-[4rem] lg:px-0">
        {/** 팀 설명 */}
        <div className="flex flex-col items-center gap-[2.4rem] self-stretch sm:flex-row sm:items-start sm:gap-[4rem]">
          {/** 팀 이미지: default 값 */}
          {teamDetail?.profileImageUrl ? (
            <div className="flex aspect-[1/1] h-[16rem] w-[16rem] flex-col items-center justify-center gap-[1rem] rounded-[1rem] bg-black-10 sm:h-[22.3rem] sm:w-[22.3rem]">
              <img
                alt={'프로필 이미지'}
                src={teamDetail?.profileImageUrl}
                className="h-[16rem] w-[16rem] rounded-[1rem] object-cover sm:h-[22.3rem] sm:w-[22.3rem]"
              />
            </div>
          ) : (
            <div className="flex aspect-[1/1] w-[16rem] flex-col items-center justify-center gap-[1rem] rounded-[1rem] bg-blue-5 py-[1.9rem] sm:w-full sm:max-w-[22.3rem]">
              <TeamDefaultImg className="h-[12rem] w-[12rem] sm:h-[18.5rem] sm:w-[18.5rem]" />
            </div>
          )}
          {/** 팀 상세 내용 */}
          <div className="flex flex-1 flex-col items-start gap-[2.4rem]">
            <div className="flex flex-col items-start justify-center gap-[1.9rem]">
              {/** 팀명 */}
              <div>
                <span className="text-[3.8rem] font-[600] leading-[1.5] tracking-[-0.076rem] text-black">
                  {teamDetail?.name ?? 'WAGGLE'}
                </span>
              </div>
              {/** 팀원 수, 오프라인/온라인, 날짜 */}
              <div className="flex items-start gap-[0.8rem]">
                {[
                  {
                    icon: <IcPersons className="h-[2rem] w-[2rem]" />,
                    label: activeMemberCount,
                  },
                  {
                    icon: <IcDesktop className="h-[2rem] w-[2rem]" />,
                    label: toWorkModeLabel(teamDetail?.workMode),
                  },
                  {
                    icon: <IcCompany className="h-[2rem] w-[2rem]" />,
                    label: teamDetail?.createdAt
                      ? formatTeamCardCreatedAt(teamDetail.createdAt)
                      : '',
                  },
                ].map(({ icon, label }, i) => (
                  <BaseTag
                    key={i}
                    size="xl"
                    shape="circle"
                    color="black80"
                    isInverted
                    leftIcon={icon}
                  >
                    {label}
                  </BaseTag>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[1.8rem] font-[500] leading-[1.5] tracking-[-0.036rem] text-black">
                {teamDetail?.description ?? '팀 소개가 들어가는 자리입니다.'}
              </span>
            </div>
          </div>
        </div>
        {/** 팀 모집글 / 팀원 관리 */}
        <div className="flex flex-col items-start gap-[3.6rem] self-stretch">
          {/** 모집글 */}
          <div className="flex flex-col items-start gap-[1.6rem] self-stretch">
            {/** 모집글 타이틀 */}
            <div className="flex items-start gap-[1rem] self-stretch border-b border-solid border-b-black-40 p-[1rem]">
              <p className="text-[2rem] font-[600] leading-[1.5] tracking-[-0.04rem] text-black">
                모집글
              </p>
            </div>
            {/** 모집글 카드들 */}
            <div className="relative self-stretch overflow-hidden">
              {canScrollLeft && (
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex">
                  <div className="flex h-[22rem] w-[22rem] items-center bg-team-home-left-slide-background pl-[1.2rem] pr-[16.4rem] backdrop-blur-none">
                    <IconWrapper
                      shape="circle"
                      color="outline"
                      children={<ChevronLeft />}
                      className="pointer-events-auto"
                      onClick={() => {
                        scrollByItem('left');
                      }}
                    />
                  </div>
                </div>
              )}

              {canScrollRight && (
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex">
                  <div className="flex h-[22rem] w-[22rem] items-center bg-team-home-right-slide-background pl-[16.4rem] pr-[1.2rem] backdrop-blur-none">
                    <IconWrapper
                      shape="circle"
                      color="outline"
                      children={<ChevronRight />}
                      className="pointer-events-auto"
                      onClick={() => {
                        scrollByItem('right');
                      }}
                    />
                  </div>
                </div>
              )}

              <div
                ref={trackRef}
                className="flex items-center gap-[1.8rem] overflow-x-auto scroll-smooth scrollbar-hide"
              >
                {applications.map((application) => {
                  const positionList: string[] = Array.from(
                    new Set(
                      application.recruitments
                        .map((r) => r.position)
                        .filter(Boolean),
                    ),
                  );

                  const skillsList: string[] = Array.from(
                    new Set(
                      application.recruitments.flatMap((r) =>
                        (r.skills ?? []).map((s) => s.trim()).filter(Boolean),
                      ),
                    ),
                  );
                  return (
                    <MainCard
                      className="!w-[36.8rem]"
                      key={application.postId}
                      variant="team"
                      mainCardTitle={application.title}
                      mainCardPositions={positionList}
                      mainCardSkills={skillsList}
                      mainCardCreatedAt={
                        application.createdAt
                          ? formatPostListCreatedAt(
                              application.createdAt,
                              nowMs,
                            )
                          : ''
                      }
                      isActive={activeCard === application.postId}
                      onClick={() => {
                        setActiveCard(application.postId);
                        navigate(`/post/${application.postId}`);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/** 팀원 관리 */}
          <div className="mb-[8rem] flex flex-col items-start gap-[1.6rem] self-stretch">
            {/** 팀원 관리 타이틀 */}
            <div className="flex items-start gap-[1rem] self-stretch border-b border-solid border-b-black-40 p-[1rem]">
              <p className="text-[2rem] font-[600] leading-[1.5] tracking-[-0.04rem] text-black">
                팀원 관리
              </p>
            </div>
            {/** 팀원 명단 카드 */}
            <div className="grid w-full grid-cols-2 gap-x-[1.2rem] gap-y-[1.6rem] self-stretch sm:grid-cols-3 sm:gap-x-[1.8rem] sm:gap-y-[2.4rem] lg:[grid-template-columns:repeat(auto-fit,23.4rem)]">
              {sortedMembers.map((member) => (
                <SideTeamCard
                  key={member.memberId}
                  variant="team"
                  memberId={member.memberId}
                  title={member.username}
                  status={teamDetail?.status}
                  profileImageUrl={member.profileImageUrl}
                  position={member.position}
                  skills={member.skills}
                  isMe={member.userId === me?.userId}
                  isLeader={member.role === 'LEADER'}
                  isManager={member.role === 'MANAGER'}
                  canManage={isLeaderOrManager && !member.deletedAt}
                  disabled={!!member.deletedAt}
                  isActive={activeTeamMember === member.memberId}
                  onClick={() => {
                    setActiveTeamMember(member.memberId);
                  }}
                  onAssignManager={handleAssignManager}
                  onKickMember={handleKickMember}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamHomePage;
