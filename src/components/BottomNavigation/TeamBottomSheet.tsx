import { useLocation, useNavigate } from 'react-router-dom';

import type { TeamResponse } from '../../types/api/team';
import BottomSheet from '../common/BottomSheet';
import SidebarItem from '../Sidebar/SidebarItem';

type TeamBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  teams: TeamResponse[];
};

const TeamBottomSheet = ({ isOpen, onClose, teams }: TeamBottomSheetProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleNavigate = (teamId: number) => {
    navigate(`/team/${teamId}`);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} aria-label="내팀">
      <div className="flex flex-col gap-[0.4rem]">
        {teams.map((team) => (
          <SidebarItem
            key={team.id}
            icon={
              team.profileImageUrl && (
                <img
                  src={team.profileImageUrl}
                  alt=""
                  className="h-[2.4rem] w-[2.4rem] rounded-[0.6rem] object-cover"
                />
              )
            }
            label={team.name}
            isActive={pathname === `/team/${team.id}`}
            onClick={() => handleNavigate(team.id)}
            unreadNotificationCount={0}
            setIsNotificationOpen={() => {}}
          />
        ))}
      </div>
    </BottomSheet>
  );
};

export default TeamBottomSheet;
