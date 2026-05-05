import type { ReactNode } from 'react';

interface SidebarIconProps {
  icon: ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  unreadNotificationCount: number;
}

const SidebarIcon = ({
  icon,
  label,
  isActive,
  onClick,
  unreadNotificationCount,
}: SidebarIconProps) => {
  const isNotificationMenu = label === '알림';

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`relative flex h-[4.4rem] w-[4.4rem] items-center justify-center rounded-[0.8rem] ${
        isActive
          ? 'bg-blue-5 text-blue-100'
          : 'bg-black-5 text-black-50 hover:bg-black-10'
      }`}
    >
      {icon}
      {isNotificationMenu && unreadNotificationCount > 0 && (
        <div className="absolute left-[3.1rem] top-[0.7rem] h-[0.6rem] w-[0.6rem] rounded-full bg-blue-80" />
      )}
    </button>
  );
};

export default SidebarIcon;
