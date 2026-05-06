import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router';

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
  subItems?: SubItem[];
  unreadNotificationCount: number;
  setIsNotificationOpen: (v: boolean) => void;
}

const SidebarIcon = ({
  icon,
  label,
  isActive,
  onClick,
  subItems,
  unreadNotificationCount,
  setIsNotificationOpen,
}: SidebarIconProps) => {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const isTeamMenu = label === '내팀';
  const isNotificationMenu = label === '알림';
  const hasMultipleTeams = subItems && subItems.length > 1;

  const handleClick = () => {
    if (hasMultipleTeams) {
      setIsOpen((prev) => !prev);
    } else if (onClick) {
      onClick();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

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
      {isTeamMenu && isOpen && (
        <div
          ref={menuRef}
          className="absolute left-[8.4rem] top-0 rounded-[0.8rem] bg-black-5 shadow-floatingBtn"
        >
          {subItems?.map((team) => (
            <button
              key={team.teamId}
              onClick={(e) => {
                e.stopPropagation();
                setIsNotificationOpen(false);
                setIsOpen(false);
                navigate(`/team/${team.teamId}`);
              }}
              className="group flex h-[4.4rem] w-[17.2rem] items-center gap-[0.4rem] rounded-[0.8rem] bg-black-5 px-[2.4rem] hover:bg-hover-5"
            >
              {team.profileImageUrl && (
                <img
                  src={team.profileImageUrl}
                  alt=""
                  className="h-[2.4rem] w-[2.4rem] rounded-[0.6rem] object-cover"
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
        </div>
      )}
    </button>
  );
};

export default SidebarIcon;
