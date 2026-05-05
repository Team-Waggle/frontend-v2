import { useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import BaseTag from '../common/Tag';
import { SIDEBAR_TRANSITION } from '../../constants/animation';

import ChevronDownIcon from '../../assets/icons/normal/chevron/ic_chevronDown.svg?react';

interface SubItem {
  teamId: number | string;
  name: string;
  profileImageUrl?: string;
}

interface SidebarMenuItemProps {
  icon: ReactNode;
  label: string;
  isActive: boolean;
  isFolded: boolean;
  onClick?: () => void;
  subItems?: SubItem[];
  unreadNotificationCount: number;
  setIsNotificationOpen: (v: boolean) => void;
}

const dropdownVariants: Variants = {
  open: {
    opacity: 1,
    height: 'auto',
    transition: {
      height: SIDEBAR_TRANSITION,
      opacity: SIDEBAR_TRANSITION,
    },
  },
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      height: SIDEBAR_TRANSITION,
      opacity: SIDEBAR_TRANSITION,
    },
  },
};

const SidebarMenuItem = ({
  icon,
  label,
  isActive,
  isFolded,
  onClick,
  subItems,
  unreadNotificationCount,
  setIsNotificationOpen,
}: SidebarMenuItemProps) => {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();
  const [isOpen, setIsOpen] = useState(false);

  const isTeamMenu = label === '내팀';
  const isNotificationMenu = label === '알림';
  const hasMultipleTeams = !!subItems && subItems.length > 1;

  const handleClick = () => {
    if (isTeamMenu && hasMultipleTeams) {
      setIsOpen((v) => !v);
      return;
    }
    onClick?.();
  };

  return (
    <div className="flex flex-col gap-[0.2rem] self-stretch">
      <button
        onClick={handleClick}
        className={`relative flex h-[4.4rem] items-center justify-start overflow-hidden rounded-[0.8rem] px-[1.2rem] ${
          isActive ? 'bg-blue-5' : 'bg-black-5 hover:bg-black-10'
        }`}
      >
        <span
          className={`flex shrink-0 items-center justify-center ${
            isActive ? 'text-blue-100' : 'text-black-50'
          }`}
        >
          {icon}
        </span>

        <span
          className={`overflow-hidden whitespace-nowrap text-[1.6rem] font-bold transition-[max-width,opacity,margin-left] duration-sidebar ease-sidebar ${
            isFolded
              ? 'ml-0 max-w-0 opacity-0'
              : 'ml-[0.8rem] max-w-[20rem] opacity-100'
          } ${isActive ? 'text-blue-100' : 'text-black-60'}`}
        >
          {label}
        </span>

        {isNotificationMenu && unreadNotificationCount > 0 && (
          <>
            <span
              className={`absolute left-[3.1rem] top-[0.7rem] h-[0.6rem] w-[0.6rem] rounded-full bg-blue-80 transition-opacity duration-sidebar ease-sidebar ${
                isFolded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <span
              className={`pointer-events-none absolute left-[21rem] top-1/2 -translate-y-1/2 whitespace-nowrap transition-opacity duration-sidebar ease-sidebar ${
                isFolded ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <BaseTag size="xs" shape="circle" color="blue80">
                {unreadNotificationCount > 100 ? '100+' : unreadNotificationCount}
              </BaseTag>
            </span>
          </>
        )}

        {isTeamMenu && hasMultipleTeams && (
          <span
            className={`pointer-events-none absolute left-[22rem] top-1/2 -translate-y-1/2 transition-opacity duration-sidebar ease-sidebar ${
              isFolded ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={SIDEBAR_TRANSITION}
              className="flex items-center justify-center"
            >
              <ChevronDownIcon className="h-[1.6rem] w-[1.6rem] text-black-40" />
            </motion.span>
          </span>
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
            className="flex flex-col gap-[0.2rem] overflow-hidden"
          >
            {subItems!.map((team) => {
              const isCurrentTeam = Number(team.teamId) === Number(teamId);
              return (
                <button
                  key={team.teamId}
                  title={team.name}
                  onClick={() => {
                    setIsNotificationOpen(false);
                    navigate(`/team/${team.teamId}`);
                  }}
                  className={`flex h-[4.4rem] items-center overflow-hidden rounded-[0.8rem] transition-[padding] duration-sidebar ease-sidebar ${
                    isFolded ? 'justify-center px-0' : 'justify-start px-[2.4rem]'
                  } ${isCurrentTeam ? 'bg-hover-5' : 'hover:bg-hover-5'}`}
                >
                  {team.profileImageUrl ? (
                    <img
                      src={team.profileImageUrl}
                      alt={team.name}
                      className="h-[2.4rem] w-[2.4rem] shrink-0 rounded-[0.4rem] object-cover"
                    />
                  ) : (
                    <div className="flex h-[2.4rem] w-[2.4rem] shrink-0 items-center justify-center rounded-[0.4rem] bg-black-10">
                      <span className="text-[1.2rem] font-bold text-black-60">
                        {team.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <span
                    className={`overflow-hidden whitespace-nowrap text-[1.4rem] transition-[max-width,opacity,margin-left] duration-sidebar ease-sidebar ${
                      isFolded
                        ? 'ml-0 max-w-0 opacity-0'
                        : 'ml-[0.6rem] max-w-[20rem] opacity-100'
                    } ${
                      isCurrentTeam
                        ? 'font-bold text-blue-100'
                        : 'font-medium text-black-60'
                    }`}
                  >
                    {team.name}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SidebarMenuItem;
