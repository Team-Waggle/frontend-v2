import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useGetUserMeTeam } from '../hooks/useUser';
import { usePatchTeamStatus } from '../hooks/useTeam';
import TeamNav from '../components/Team/TeamNav';
import TeamStatusCard from '../components/Team/TeamStatusCard';
import TeamStatusModal from '../components/Modal/TeamStatusModal';

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
    description: `팀이 만들어졌어요! \n팀원들을 모집해보아요.`,
    ActiveIcon: PreparingIcon,
    InactiveIcon: PreparingGrayIcon,
    buttonText: '모집하기',
  },
  {
    type: 'ACTIVE',
    title: '진행중',
    description: `현재 팀 활동이 활발하게 \n진행되고 있습니다.`,
    ActiveIcon: ActiveIcon,
    InactiveIcon: ActiveGrayIcon,
    buttonText: '팀 활동 완료하기',
  },
  {
    type: 'COMPLETED',
    title: '완료',
    description: `모든 프로젝트가 마무리되어 \n활동이 종료된 상태입니다.`,
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
      모집글을 작성해보세요.
    </span>
  ),
  ACTIVE: (
    <span className="text-[1.6rem] font-normal text-black-80">
      현재 팀이
      <span className="font-bold text-blue-100"> 진행중 </span>
      상태입니다. 팀원들과 목표한 작업을 모두 마무리하셨나요? 팀이 끝나면
      <span className="font-bold text-blue-100"> 완료 </span>
      처리를 해주세요.
    </span>
  ),
  COMPLETED: (
    <span className="text-[1.6rem] font-normal text-black-80">
      모든 프로젝트가 마무리되어 팀 활동이
      <span className="font-bold text-blue-100"> 종료</span>된 상태입니다.
      <span className="font-bold text-blue-100">리뷰를 진행해 주세요.</span>
    </span>
  ),
};

const TeamStatusPage = () => {
  const navigate = useNavigate();
  const { data } = useGetUserMeTeam();
  const { teamId } = useParams<{ teamId: string }>();
  const currentTeam = data?.find((team) => team.id === Number(teamId));
  const { mutate } = usePatchTeamStatus();
  const queryClient = useQueryClient();

  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleClick = () => {
    if (currentTeam?.status === 'PREPARING') {
      navigate('/post/new');
    } else if (currentTeam?.status === 'ACTIVE') {
      setIsOpenModal(true);
    } else if (currentTeam?.status === 'COMPLETED') {
      navigate(`/team/${currentTeam?.id}`);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-[6rem] pt-[5.4rem]">
        <TeamNav />
        <div className="flex w-full max-w-[clamp(98.2rem,70vw,130rem)] flex-col gap-[2.8rem]">
          <div className="flex flex-col gap-[2.8rem]">
            <div className="flex justify-between gap-[clamp(2.6rem,calc(-7.3rem+6.875vw),5.9rem)]">
              {STATUS_CONFIG.map((item) => (
                <TeamStatusCard
                  key={item.type}
                  type={item.type}
                  currentStatus={currentTeam?.status ?? 'PREPARING'}
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
            <div className="flex gap-[1.6rem] rounded-[1.2rem] bg-blue-5 p-[2rem]">
              <CircleInfoIcon className="text-blue-100" />
              <div className="flex flex-col gap-[0.8rem]">
                <span className="text-[1.8rem] font-semibold text-black-100">
                  현재 상태 안내
                </span>
                {STATUS_INFO[currentTeam?.status as keyof typeof STATUS_INFO]}
              </div>
            </div>
          </div>
        </div>
      </div>
      <TeamStatusModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        handleDone={() => {
          const teamId = currentTeam?.id;
          if (!teamId) return;
          mutate(
            { teamId, status: 'COMPLETED' },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['user-me-team'] });
                queryClient.invalidateQueries({
                  queryKey: ['my-notifications-count'],
                });

                setIsOpenModal(false);
              },
              onError: (err) => {
                console.log(err);
              },
            },
          );
        }}
      />
    </>
  );
};

export default TeamStatusPage;
