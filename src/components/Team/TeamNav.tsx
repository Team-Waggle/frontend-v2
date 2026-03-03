import { useLocation } from 'react-router';
import TeamTab from '../common/Tap/TeamTab';

const TeamNav = () => {
  const location = useLocation();

  const tabs = [
    { label: '메인 홈', to: '/team/home' },
    { label: '모집글 관리', to: '/' },
    { label: '지원자 관리', to: '/' },
    { label: '팀 상태 관리', to: '/' },
  ] as const;

  return (
    <div className="flex w-full max-w-[clamp(98.2rem,70vw,130rem)] items-center gap-[2.4rem]">
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
