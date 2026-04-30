import { useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import BaseTag from '../common/Tag';

// Icons
import ChevronDownIcon from '../../assets/icons/normal/chevron/ic_chevronDown.svg?react';

interface SubItem {
  teamId: number | string;
  name: string;
  profileImageUrl?: string;
}

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  subItems?: SubItem[];
  unreadNotificationCount: number;
  setIsNotificationOpen: (v: boolean) => void;
}

const SidebarItem = ({
  icon,
  label,
  isActive,
  onClick,
  subItems,
  unreadNotificationCount,
  setIsNotificationOpen,
}: SidebarItemProps) => {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();
  const [isOpen, setIsOpen] = useState(false);

  const isTeamMenu = label === '내팀';
  const isNotificationMenu = label === '알림';
  const hasMultipleTeams = subItems && subItems.length > 1;

  const dropdownVariants: Variants = {
    open: {
      opacity: 1,
      height: 'auto',
      transition: {
        height: {
          type: 'spring',
          mass: 1,
          stiffness: 320,
          damping: 40,
        },
        opacity: {
          duration: 0.15,
        },
      },
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        height: {
          type: 'spring',
          mass: 1,
          stiffness: 100,
          damping: 20,
        },
        opacity: {
          duration: 0.5,
        },
      },
    },
  };

  const handleClick = () => {
    if (hasMultipleTeams) {
      setIsOpen(!isOpen);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <>
      <div className="cursor-pointer" onClick={handleClick}>
        <div
          className={`flex h-[4.4rem] items-center rounded-[0.8rem] px-[1.2rem] ${
            isActive ? 'bg-blue-5' : 'bg-black-5 hover:bg-black-10'
          }`}
        >
          <div
            className={`flex w-[21.8rem] gap-[0.8rem] ${isActive ? 'text-blue-100' : 'text-black-50'}`}
          >
            {icon}
            <span
              className={`text-[1.6rem] font-bold ${isActive ? 'text-blue-100' : 'text-black-60'}`}
            >
              {label}
            </span>
          </div>
          {isNotificationMenu && unreadNotificationCount > 0 && (
            <BaseTag size="xs" shape="circle" color="blue80">
              {unreadNotificationCount > 100 ? '100+' : unreadNotificationCount}
            </BaseTag>
          )}

          {/* 화살표 숨기기 */}
          {isTeamMenu && hasMultipleTeams && (
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <ChevronDownIcon className="h-[1.6rem] w-[1.6rem] text-black-40" />
            </motion.div>
          )}
        </div>
        <AnimatePresence initial={false}>
          {isOpen && isTeamMenu && hasMultipleTeams && (
            <motion.div
              key="content"
              variants={dropdownVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="overflow-hidden"
            >
              {subItems.map((team) => (
                <button
                  key={team.teamId}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsNotificationOpen(false);
                    navigate(`/team/${team.teamId}`);
                  }}
                  className="group flex h-[4.4rem] w-full items-center gap-[0.4rem] rounded-[0.8rem] px-[2.4rem] hover:bg-hover-5"
                >
                  {team.profileImageUrl && (
                    <img
                      src={team.profileImageUrl}
                      alt=""
                      className="h-[2.4rem] w-[2.4rem] rounded-[0.6rem]"
                    />
                  )}
                  <span
                    className={`text-[1.4rem] ${
                      Number(team.teamId) === Number(teamId)
                        ? 'font-bold text-blue-100'
                        : 'font-medium text-black-60 group-hover:text-black-80'
                    }`}
                  >
                    {team.name}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default SidebarItem;
