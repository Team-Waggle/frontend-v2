import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { useAuthStore } from '../../stores/authStore';
import {
  useGetIsUserProfileComplete,
  useGetUserMe,
  useGetUserMeTeam,
} from '../../hooks/useUser';
import LoginModal from '../Modal/LoginModal';
import WriteBottomSheet from './WriteBottomSheet';
import TeamBottomSheet from './TeamBottomSheet';

import HomeIcon from '../../assets/icons/normal/ic_home.svg?react';
import HomeFillIcon from '../../assets/icons/normal/ic_home_fill.svg?react';
import FaceSmileIcon from '../../assets/icons/normal/ic_faceSmile.svg?react';
import FaceSmileFillIcon from '../../assets/icons/normal/ic_faceSmile_fill.svg?react';
import PencilIcon from '../../assets/icons/normal/ic_pencil.svg?react';
import PencilFillIcon from '../../assets/icons/normal/ic_pencil_fill.svg?react';
import MessageIcon from '../../assets/icons/normal/ic_message.svg?react';
import MessageFillIcon from '../../assets/icons/normal/ic_message_fill.svg?react';
import PersonIcon from '../../assets/icons/normal/ic_person.svg?react';
import PersonFillIcon from '../../assets/icons/normal/ic_person_fill.svg?react';

type NavItemConfig = {
  key: string;
  label: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  requiresAuth?: boolean;
};

const NAV_ITEMS: NavItemConfig[] = [
  {
    key: 'home',
    label: '홈',
    icon: <HomeIcon />,
    activeIcon: <HomeFillIcon />,
  },
  {
    key: 'message',
    label: '메시지',
    icon: <MessageIcon />,
    activeIcon: <MessageFillIcon />,
    requiresAuth: true,
  },
  {
    key: 'team',
    label: '내팀',
    icon: <FaceSmileIcon />,
    activeIcon: <FaceSmileFillIcon />,
    requiresAuth: true,
  },
  {
    key: 'write',
    label: '글쓰기',
    icon: <PencilIcon />,
    activeIcon: <PencilFillIcon />,
    requiresAuth: true,
  },
  {
    key: 'profile',
    label: '마이페이지',
    icon: <PersonIcon />,
    activeIcon: <PersonFillIcon />,
    requiresAuth: true,
  },
];

const BottomNavigation = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isWriteSheetOpen, setIsWriteSheetOpen] = useState(false);
  const [isTeamSheetOpen, setIsTeamSheetOpen] = useState(false);

  const { accessToken } = useAuthStore();
  const isLoggedIn = !!accessToken;

  const { data: isProfileCompleteData } = useGetIsUserProfileComplete();
  const { data: myData } = useGetUserMe();
  const { data: myteamData } = useGetUserMeTeam();

  const isProfileVisible = isLoggedIn && !!isProfileCompleteData?.complete;
  const hasWritableTeam = !!myteamData?.some(
    (team) => team.role !== 'MEMBER' && team.status !== 'COMPLETED',
  );

  const getPath = (key: string) => {
    switch (key) {
      case 'home':
        return '/';
      case 'team':
        return myteamData?.[0]?.id ? `/team/${myteamData[0].id}` : '/team/new';
      case 'message':
        return '/message';
      case 'profile':
        return myData?.id ? `/profile/${myData.id}` : '/';
      default:
        return '/';
    }
  };

  const isActive = (key: string) => {
    if (key === 'home') return pathname === '/';
    if (key === 'write')
      return pathname === '/team/new' || pathname === '/post/new';
    return (
      pathname.includes(key) && !(key === 'team' && pathname === '/team/new')
    );
  };

  const handleClick = (item: NavItemConfig) => {
    if (item.requiresAuth && !isProfileVisible) {
      setIsLoginModalOpen(true);
      return;
    }
    if (item.key === 'write') {
      setIsWriteSheetOpen(true);
      return;
    }
    if (item.key === 'team' && myteamData && myteamData.length > 0) {
      setIsTeamSheetOpen(true);
      return;
    }
    navigate(getPath(item.key));
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center border-t border-black-20 bg-black-5">
        <div className="flex h-[4.8rem] w-full items-center justify-between max-sm:px-[8.8rem] max-471:px-[2rem]">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.key);
            return (
              <button
                key={item.key}
                onClick={() => handleClick(item)}
                className="flex flex-col items-center justify-center"
              >
                <span
                  className={`relative ${active ? 'text-blue-100' : 'text-black-60'} flex aspect-square h-[4.8rem] w-[4.8] flex-shrink-0 flex-col items-center justify-center gap-[1rem] rounded-[0.8rem] bg-white`}
                >
                  {active ? item.activeIcon : item.icon}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <WriteBottomSheet
        isOpen={isWriteSheetOpen}
        onClose={() => setIsWriteSheetOpen(false)}
        hasWritableTeam={hasWritableTeam}
      />

      <TeamBottomSheet
        isOpen={isTeamSheetOpen}
        onClose={() => setIsTeamSheetOpen(false)}
        teams={myteamData ?? []}
      />
    </>
  );
};

export default BottomNavigation;
