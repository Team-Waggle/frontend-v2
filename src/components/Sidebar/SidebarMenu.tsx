import { useNavigate } from 'react-router';
import SidebarIcon from './SidebarIcon';
import SidebarItem from './SidebarItem';

// Icons
import FaceSmileIcon from '../../assets/icons/normal/ic_faceSmile.svg?react';
import BellIcon from '../../assets/icons/normal/ic_bell.svg?react';
import MessageIcon from '../../assets/icons/normal/ic_message.svg?react';
import PersonIcon from '../../assets/icons/normal/ic_person.svg?react';

type SidebarPathType = {
  teamId?: number;
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
    icon: <FaceSmileIcon className="text-black-40" />,
    getPath: ({ teamId }) => `/team/${teamId}`,
  },
  {
    key: 'notification',
    label: '알림',
    icon: <BellIcon className="text-black-40" />,
    getPath: () => '/notification',
  },
  {
    key: 'message',
    label: '메시지',
    icon: <MessageIcon className="text-black-40" />,
    getPath: () => '/message',
  },
  {
    key: 'mypage',
    label: '마이페이지',
    icon: <PersonIcon className="text-black-40" />,
    getPath: ({ userId }) => `/profile/${userId}`,
  },
];

// const myTeams = [
//   { id: 1, name: '와글팀' },
//   { id: 2, name: '일이삼사오육칠팔구' },
// ];

const SidebarMenu = ({
  isLoggedIn,
  setIsLoginModalOpen,
  isFolded,
  teamId,
  userId,
}: {
  isLoggedIn: boolean;
  setIsLoginModalOpen: () => void;
  isFolded: boolean;
  teamId?: number;
  userId?: string;
}) => {
  const navigate = useNavigate();

  const visibleMenus = isLoggedIn
    ? SIDEBAR_MENUS
    : SIDEBAR_MENUS.filter((menu) => menu.key === 'team');

  return (
    <div
      className={`flex flex-col gap-[0.4rem] ${isFolded ? 'w-[4.8rem]' : 'w-[25.8rem]'}`}
    >
      {visibleMenus.map(({ key, icon, label, getPath }) => {
        const path = getPath({ teamId, userId });

        const handleClick = () => {
          if (!isLoggedIn && key === 'team') {
            setIsLoginModalOpen();
            return;
          }
          if (!path) return;
          navigate(path);
        };

        return isFolded ? (
          <SidebarIcon key={key} icon={icon} onClick={handleClick} />
        ) : (
          <SidebarItem
            key={key}
            icon={icon}
            label={label}
            onClick={handleClick}
          />
        );
      })}
    </div>
  );
};

export default SidebarMenu;
