import type { TeamResponse } from '../types/api/team';

import HomeIcon from '../assets/icons/normal/ic_home.svg?react';
import FaceSmileIcon from '../assets/icons/normal/ic_faceSmile.svg?react';
import BellIcon from '../assets/icons/normal/ic_bell.svg?react';
import MessageIcon from '../assets/icons/normal/ic_message.svg?react';
import PersonIcon from '../assets/icons/normal/ic_person.svg?react';

type NavPathContext = {
  teamData: TeamResponse[];
  userId?: string;
};

export type NavItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
  getPath: (ctx: NavPathContext) => string;
};

export const NAV_MENUS: NavItem[] = [
  {
    key: 'home',
    label: '홈',
    icon: <HomeIcon />,
    getPath: () => '/',
  },
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
