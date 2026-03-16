import type { ReactNode } from 'react';

interface SidebarIconProps {
  icon: ReactNode;
  isActive: boolean;
  onClick?: () => void;
}

const SidebarIcon = ({ icon, isActive, onClick }: SidebarIconProps) => {
  const handleClick = () => {
    if (onClick) onClick();
  };
  return (
    <button
      onClick={handleClick}
      className={`flex h-[4.4rem] w-[4.4rem] items-center rounded-[0.8rem] px-[1.2rem] ${
        isActive
          ? 'bg-blue-5 text-blue-100'
          : 'bg-black-5 text-black-50 hover:bg-black-10'
      }`}
    >
      {icon}
    </button>
  );
};

export default SidebarIcon;
