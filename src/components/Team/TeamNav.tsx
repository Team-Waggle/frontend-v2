import { useLocation, useParams } from 'react-router';
import TeamTab from '../common/Tap/TeamTab';

const TeamNav = () => {
  const location = useLocation();
  const { teamId } = useParams<{ teamId: string }>();

  const tabs = [
    { label: '메인 홈', to: `/team/${teamId}` },
    { label: '모집글 관리', to: `/team/${teamId}/recruitments` },
    { label: '지원자 관리', to: '/' },
    { label: '팀 상태 관리', to: `/team/${teamId}/status` },
  ] as const;

  return (
    <div className="flex w-full max-w-full items-center gap-[1.2rem] overflow-x-auto border-b border-solid border-black-20 px-[1.6rem] scrollbar-hide sm:gap-[2.4rem] sm:px-[2.4rem] lg:max-w-[clamp(98.2rem,70vw,130rem)] lg:px-0">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.to;

        return (
          <TeamTab key={tab.to} to={tab.to} isActive={isActive}>
            {tab.label}
          </TeamTab>
        );
      })}
    </div>
  );
};

export default TeamNav;
