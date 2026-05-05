import { useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AnimatePresence, motion, type Variants } from 'framer-motion';

interface SubItem {
  teamId: number | string;
  name: string;
  profileImageUrl?: string;
}

interface SidebarIconProps {
  icon: ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  unreadNotificationCount: number;
  subItems?: SubItem[];
  setIsNotificationOpen?: (v: boolean) => void;
}

const dropdownVariants: Variants = {
  open: {
    opacity: 1,
    height: 'auto',
    transition: {
      height: { type: 'spring', mass: 1, stiffness: 320, damping: 40 },
      opacity: { duration: 0.15 },
    },
  },
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      height: { type: 'spring', mass: 1, stiffness: 100, damping: 20 },
      opacity: { duration: 0.5 },
    },
  },
};

const SidebarIcon = ({
  icon,
  label,
  isActive,
  onClick,
  unreadNotificationCount,
  subItems,
  setIsNotificationOpen,
}: SidebarIconProps) => {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();
  const [isOpen, setIsOpen] = useState(false);

  const isNotificationMenu = label === '알림';
  const isTeamMenu = label === '내팀';
  const hasMultipleTeams = !!subItems && subItems.length > 1;

  const handleClick = () => {
    if (isTeamMenu && hasMultipleTeams) {
      setIsOpen((v) => !v);
      return;
    }
    onClick?.();
  };

  return (
    <div className="flex flex-col items-center gap-[0.4rem]">
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
      <AnimatePresence initial={false}>
        {isOpen && isTeamMenu && hasMultipleTeams && (
          <motion.div
            key="team-accordion"
            variants={dropdownVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="flex flex-col items-center gap-[0.4rem] overflow-hidden"
          >
            {subItems!.map((team) => {
              const isCurrentTeam = Number(team.teamId) === Number(teamId);
              return (
                <button
                  key={team.teamId}
                  title={team.name}
                  onClick={() => {
                    setIsNotificationOpen?.(false);
                    navigate(`/team/${team.teamId}`);
                  }}
                  className={`flex h-[4.4rem] w-[4.4rem] items-center justify-center overflow-hidden rounded-[0.8rem] border-2 ${
                    isCurrentTeam
                      ? 'border-blue-70'
                      : 'border-transparent hover:border-black-30'
                  } ${team.profileImageUrl ? '' : 'bg-black-10'}`}
                >
                  {team.profileImageUrl ? (
                    <img
                      src={team.profileImageUrl}
                      alt={team.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-[1.4rem] font-bold text-black-60">
                      {team.name.charAt(0)}
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SidebarIcon;
