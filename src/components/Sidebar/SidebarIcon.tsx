import type { ReactNode } from 'react';

interface SidebarIconProps {
  icon: ReactNode;
  onClick?: () => void;
}

const SidebarIcon = ({ icon, onClick }: SidebarIconProps) => {
  const handleClick = () => {
    if (onClick) onClick();
  };
  return (
    <button
      onClick={handleClick}
      className="flex h-[4.4rem] w-[4.4rem] items-center rounded-[0.8rem] px-[1.2rem] hover:bg-black-10"
    >
      {icon}
    </button>
  );
};

export default SidebarIcon;
