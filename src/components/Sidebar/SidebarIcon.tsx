import type { ReactNode } from 'react';

const SidebarIcon = ({ icon }: { icon: ReactNode }) => {
  return (
    <button className="flex h-[4.4rem] w-[4.4rem] items-center rounded-[0.8rem] px-[1.2rem] hover:bg-black-10">
      {icon}
    </button>
  );
};

export default SidebarIcon;
