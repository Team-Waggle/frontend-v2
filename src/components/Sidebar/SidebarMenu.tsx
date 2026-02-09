import SidebarIcon from './SidebarIcon';
import SidebarItem from './SidebarItem';

// Icons
import FaceSmileIcon from '../../assets/icons/normal/ic_faceSmile.svg?react';
import BellIcon from '../../assets/icons/normal/ic_bell.svg?react';
import MessageIcon from '../../assets/icons/normal/ic_message.svg?react';
import PersonIcon from '../../assets/icons/normal/ic_person.svg?react';

const SIDEBAR_MENUS = [
  {
    key: 'team',
    label: '내팀',
    icon: <FaceSmileIcon className="text-black-40" />,
  },
  {
    key: 'notification',
    label: '알림',
    icon: <BellIcon className="text-black-40" />,
  },
  {
    key: 'message',
    label: '메시지',
    icon: <MessageIcon className="text-black-40" />,
  },
  {
    key: 'mypage',
    label: '마이페이지',
    icon: <PersonIcon className="text-black-40" />,
  },
];

const myTeams = [
  { id: 1, name: '와글팀' },
  { id: 2, name: '일이삼사오육칠팔구' },
];

const SidebarMenu = ({ isFolded }: { isFolded: boolean }) => {
  return (
    <div
      className={`flex flex-col gap-[0.4rem] ${isFolded ? 'w-[4.8rem]' : 'w-[25.8rem]'}`}
    >
      {SIDEBAR_MENUS.map(({ key, icon, label }) =>
        isFolded ? (
          <SidebarIcon key={key} icon={icon} />
        ) : (
          <SidebarItem key={key} icon={icon} label={label} subItems={myTeams} />
        ),
      )}
    </div>
  );
};

export default SidebarMenu;
