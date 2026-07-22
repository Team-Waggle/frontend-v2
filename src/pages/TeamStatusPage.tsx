import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useGetUserMeTeam } from '../hooks/useUser';
import {
  useDeleteTeam,
  useGetTeamPosts,
  usePatchTeamStatus,
} from '../hooks/useTeam';
import { usePatchPostClose } from '../hooks/usePost';
import BaseButton from '../components/common/Button';
import TeamNav from '../components/Team/TeamNav';
import TeamStatusCard from '../components/Team/TeamStatusCard';
import TeamStatusModal from '../components/Modal/TeamStatusModal';
import TeamDeleteModal from '../components/Modal/TeamDeleteModal';

// Icons
import PreparingIcon from '../assets/icons/ic_preparing.svg?react';
import PreparingGrayIcon from '../assets/icons/ic_preparing_gray.svg?react';
import ActiveIcon from '../assets/icons/ic_active.svg?react';
import ActiveGrayIcon from '../assets/icons/ic_active_gray.svg?react';
import CompleteIcon from '../assets/icons/ic_complete.svg?react';
import CompleteGrayIcon from '../assets/icons/ic_complete_gray.svg?react';
import CircleInfoIcon from '../assets/icons/normal/ic_circleInfo_fill.svg?react';

const STATUS_CONFIG = [
  {
    type: 'PREPARING',
    title: '준비중',
    description: `팀이 만들어졌어요. \n팀원들을 모집해볼까요?`,
    ActiveIcon: PreparingIcon,
    InactiveIcon: PreparingGrayIcon,
    buttonText: '모집하기',
  },
  {
    type: 'ACTIVE',
    title: '진행중',
    description: `현재 팀 활동이 진행되고 있습니다. \n조금만 더 힘내서 유종의 미를 거둬볼까요?`,
    ActiveIcon: ActiveIcon,
    InactiveIcon: ActiveGrayIcon,
    buttonText: '완료하기',
  },
  {
    type: 'COMPLETED',
    title: '완료',
    description: `프로젝트가 마무리되어, \n팀 활동이 종료된 상태입니다.`,
    ActiveIcon: CompleteIcon,
    InactiveIcon: CompleteGrayIcon,
    buttonText: '리뷰하기',
  },
] as const;

const STATUS_INFO = {
  PREPARING: (
    <span className="text-[1.6rem] font-normal text-black-80">
      아직 모집글이 없어요. ‘
      <span className="font-bold text-blue-100">모집하기</span>’ 버튼을 눌러 첫
      모집글을 작성해 보세요.
    </span>
  ),
  ACTIVE: (
    <span className="text-[1.6rem] font-normal text-black-80">
      팀원들과 목표한 작업을 모두 마무리하셨나요? 팀 활동이 끝나면 ‘
      <span className="font-bold text-blue-100"> 완료하기 </span>’ 버튼을
      클릭해주세요.
    </span>
  ),
  COMPLETED: (
    <span className="text-[1.6rem] font-normal text-black-80">
      팀 활동이
      <span className="font-bold text-blue-100"> 종료</span>된 상태입니다. ‘
      <span className="font-bold text-blue-100">리뷰하기</span>’ 버튼을 눌러
      함께한 팀원들의 리뷰를 진행해주세요.
    </span>
  ),
};

const TeamStatusPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: myTeamData } = useGetUserMeTeam();
  const { teamId } = useParams<{ teamId: string }>();
  const currentTeam = myTeamData?.find((team) => team.id === Number(teamId));
  const { data: teamPosts } = useGetTeamPosts(Number(teamId));

  const { mutate: updateTeamStatus } = usePatchTeamStatus();
  const { mutate: deleteTeam } = useDeleteTeam();
  const { mutateAsync: closePostAsync } = usePatchPostClose();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenTeamDeleteModal, setIsOpenTeamDeleteModal] = useState(false);
  const dragStartX = useRef(0);
  const dragMoved = useRef(false);
  const currentStatus = currentTeam?.status ?? 'PREPARING';
  const activeStatusIndex = Math.max(
    STATUS_CONFIG.findIndex((item) => item.type === currentStatus),
    0,
  );
  const [mobileStatusIndex, setMobileStatusIndex] = useState(activeStatusIndex);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setMobileStatusIndex(activeStatusIndex);
  }, [activeStatusIndex]);

  const handleClick = () => {
    if (currentTeam?.status === 'PREPARING') {
      navigate('/post/new');
    } else if (currentTeam?.status === 'ACTIVE') {
      setIsOpenModal(true);
    } else if (currentTeam?.status === 'COMPLETED') {
      navigate(`/team/${currentTeam?.id}`);
    }
  };

  const handleCarouselPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (!event.isPrimary) return;

    dragStartX.current = event.clientX;
    dragMoved.current = false;
    setIsDragging(true);
    setDragOffsetX(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleCarouselPointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (!isDragging) return;

    const nextOffsetX = event.clientX - dragStartX.current;
    setDragOffsetX(nextOffsetX);
  };

  const handleCarouselPointerEnd = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (!isDragging) return;

    const finalOffsetX = event.clientX - dragStartX.current;
    const threshold = event.currentTarget.clientWidth * 0.2;
    const isSwipeGesture = Math.abs(finalOffsetX) > threshold;
    const nextIndex = isSwipeGesture
      ? mobileStatusIndex + (finalOffsetX < 0 ? 1 : -1)
      : mobileStatusIndex;

    setMobileStatusIndex(
      Math.min(Math.max(nextIndex, 0), STATUS_CONFIG.length - 1),
    );
    setIsDragging(false);
    setDragOffsetX(0);
    dragMoved.current = isSwipeGesture;
  };

  const handleCarouselClickCapture = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    const target = event.target as HTMLElement | null;

    if (target?.closest('button')) {
      dragMoved.current = false;
      return;
    }

    if (!dragMoved.current) return;

    event.preventDefault();
    event.stopPropagation();
    dragMoved.current = false;
  };

  return (
    <>
      <div className="flex flex-col items-center gap-[6rem] pt-[5.4rem] max-sm:pt-[1rem]">
        {currentTeam?.role !== 'MEMBER' && <TeamNav />}
        <div className="flex w-full max-w-[clamp(98.2rem,70vw,130rem)] flex-col gap-[3.5rem] max-sm:px-[2rem] max-sm:pb-[8rem]">
          <div className="flex flex-col gap-[2.8rem] max-sm:gap-[3.5rem]">
            <div className="flex justify-between gap-[clamp(2.6rem,calc(-7.3rem+6.875vw),5.9rem)] max-sm:hidden">
              {STATUS_CONFIG.map((item) => (
                <TeamStatusCard
                  key={item.type}
                  type={item.type}
                  currentStatus={currentStatus}
                  title={item.title}
                  description={item.description}
                  ActiveIcon={item.ActiveIcon}
                  InactiveIcon={item.InactiveIcon}
                  buttonText={item.buttonText}
                  onClick={() => {
                    handleClick();
                  }}
                />
              ))}
            </div>
            <div className="hidden flex-col gap-[1.8rem] max-sm:flex">
              <div
                className="cursor-grab overflow-hidden active:cursor-grabbing"
                onPointerDown={handleCarouselPointerDown}
                onPointerMove={handleCarouselPointerMove}
                onPointerUp={handleCarouselPointerEnd}
                onPointerCancel={handleCarouselPointerEnd}
                onClickCapture={handleCarouselClickCapture}
                style={{ touchAction: 'pan-y' }}
              >
                <div
                  className={`flex ${
                    isDragging
                      ? 'transition-none'
                      : 'transition-transform duration-300 ease-out'
                  }`}
                  style={{
                    transform: `translateX(calc(-${mobileStatusIndex * 100}% + ${dragOffsetX}px))`,
                  }}
                >
                  {STATUS_CONFIG.map((item) => (
                    <div
                      key={item.type}
                      className="flex min-w-full justify-center"
                    >
                      <TeamStatusCard
                        type={item.type}
                        currentStatus={currentStatus}
                        title={item.title}
                        description={item.description}
                        ActiveIcon={item.ActiveIcon}
                        InactiveIcon={item.InactiveIcon}
                        buttonText={item.buttonText}
                        onClick={() => {
                          handleClick();
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-[0.8rem]">
                {STATUS_CONFIG.map((item, index) => (
                  <button
                    key={item.type}
                    type="button"
                    aria-label={`${item.title} 상태 보기`}
                    onClick={() => setMobileStatusIndex(index)}
                    className={`h-[0.8rem] w-[0.8rem] rounded-full ${
                      mobileStatusIndex === index ? 'bg-blue-80' : 'bg-black-30'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-[1.6rem] rounded-[1.2rem] bg-blue-5 p-[2rem]">
              <CircleInfoIcon className="shrink-0 text-blue-100" />
              <div className="flex flex-col gap-[0.8rem]">
                <span className="text-[1.8rem] font-semibold text-black-100">
                  현재 상태 안내
                </span>
                {STATUS_INFO[currentStatus]}
              </div>
            </div>
          </div>
          {currentTeam?.role === 'LEADER' && (
            <div className="flex justify-end">
              <BaseButton
                size="sm"
                color="secondary"
                onClick={() => setIsOpenTeamDeleteModal(true)}
                className="w-[7.2rem] whitespace-nowrap text-black-60"
              >
                팀 삭제
              </BaseButton>
            </div>
          )}
        </div>
      </div>
      <TeamStatusModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        handleDone={async () => {
          const currentTeamId = currentTeam?.id;
          if (!currentTeamId) return;
          try {
            if (teamPosts && teamPosts.length > 0) {
              const activePosts = teamPosts.filter((post) => post.recruiting);
              if (activePosts.length > 0) {
                const closePromises = activePosts.map((post) =>
                  closePostAsync({
                    postId: post.id,
                    status: 'CLOSED',
                  }),
                );
                await Promise.all(closePromises);
              }
            }
            updateTeamStatus(
              { teamId: currentTeamId, status: 'COMPLETED' },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ['user-me-team'] });
                  queryClient.invalidateQueries({
                    queryKey: ['my-notifications-count'],
                  });
                  queryClient.invalidateQueries({
                    queryKey: ['team-posts', currentTeamId],
                  });

                  setIsOpenModal(false);
                },
                onError: (err) => {
                  console.log(err);
                },
              },
            );
          } catch (error) {
            console.error(error);
            alert('모집글 마감 처리 중 오류가 발생했습니다.');
          }
        }}
      />
      <TeamDeleteModal
        isOpen={isOpenTeamDeleteModal}
        onClose={() => setIsOpenTeamDeleteModal(false)}
        handleDone={() => deleteTeam(Number(currentTeam?.id))}
      />
    </>
  );
};

export default TeamStatusPage;
