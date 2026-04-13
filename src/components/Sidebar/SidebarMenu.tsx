import { useLocation, useNavigate } from 'react-router';
import SidebarIcon from './SidebarIcon';
import SidebarItem from './SidebarItem';
import type { TeamResponse } from '../../types/api/team';
import { NAV_MENUS } from '../../constants/navigation';

const SIDEBAR_MENUS = NAV_MENUS.filter((menu) => menu.key !== 'home');

const SidebarMenu = ({
  isLoggedIn,
  setIsLoginModalOpen,
  isFolded,
  teamData,
  userId,
}: {
  isLoggedIn: boolean;
  setIsLoginModalOpen: () => void;
  isFolded: boolean;
  teamData: TeamResponse[];
  userId?: string;
}) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const visibleMenus = isLoggedIn
    ? SIDEBAR_MENUS
    : SIDEBAR_MENUS.filter((menu) => menu.key === 'team');

  const teamSubItems = isLoggedIn
    ? teamData.map((team) => ({
        teamId: team.teamId,
        name: team.name,
        profileImageUrl: team.profileImageUrl,
      }))
    : [];

  return (
    <div
      className={`flex flex-col gap-[0.4rem] ${isFolded ? 'w-[4.8rem]' : 'w-[25.8rem]'}`}
    >
      {visibleMenus.map(({ key, icon, label, getPath }) => {
        const path = getPath({ teamData, userId });

        const isActive =
          pathname.includes(key) &&
          !(key === 'team' && pathname === '/team/new');

        const handleClick = () => {
          if (!isLoggedIn && key === 'team') {
            setIsLoginModalOpen();
            return;
          }
          if (!path) return;
          navigate(path);
        };

        return isFolded ? (
          <SidebarIcon
            key={key}
            icon={icon}
            isActive={isActive}
            onClick={handleClick}
          />
        ) : (
          <SidebarItem
            key={key}
            icon={icon}
            label={label}
            isActive={isActive}
            subItems={key === 'team' ? teamSubItems : undefined}
            onClick={handleClick}
          />
        );
      })}
    </div>
  );
};

export default SidebarMenu;
