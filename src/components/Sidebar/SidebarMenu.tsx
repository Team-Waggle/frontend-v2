import { useLocation, useNavigate } from 'react-router';
import SidebarIcon from './SidebarIcon';
import SidebarItem from './SidebarItem';
import type { TeamResponse } from '../../types/api/team';

// Icons
import FaceSmileIcon from '../../assets/icons/normal/ic_faceSmile.svg?react';
import BellIcon from '../../assets/icons/normal/ic_bell.svg?react';
import MessageIcon from '../../assets/icons/normal/ic_message.svg?react';
import PersonIcon from '../../assets/icons/normal/ic_person.svg?react';

type SidebarPathType = {
  teamData: TeamResponse[];
  userId?: string;
};

type SidebarMenu = {
  key: string;
  label: string;
  icon: React.ReactNode;
  getPath: (id: SidebarPathType) => string;
};

const SIDEBAR_MENUS: SidebarMenu[] = [
  {
    key: 'team',
    label: '내팀',
    icon: <FaceSmileIcon />,
    getPath: ({ teamData }) =>
      teamData?.[0]?.teamId ? `/team/${teamData[0].teamId}` : '/team/new',
  },
  {
    key: 'notification',
    label: '알림',
    icon: <BellIcon />,
    getPath: () => '/notification',
  },
  {
    key: 'message',
    label: '메시지',
    icon: <MessageIcon />,
    getPath: () => '/message',
  },
  {
    key: 'profile',
    label: '마이페이지',
    icon: <PersonIcon />,
    getPath: ({ userId }) => `/profile/${userId}`,
  },
];

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
