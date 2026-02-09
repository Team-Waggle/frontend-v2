import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';

// Icons
import ChevronDownIcon from '../../assets/icons/normal/chevron/ic_chevronDown.svg?react';

interface SubItem {
  id: number | string;
  name: string;
}

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  subItems?: SubItem[];
}

const SidebarItem = ({ icon, label, onClick, subItems }: SidebarItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasSubItems = subItems && subItems.length > 0;

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
    if (hasSubItems) {
      setIsOpen(!isOpen);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <>
      <button onClick={handleClick}>
        <div className="flex h-[4.4rem] items-center rounded-[0.8rem] bg-black-5 px-[1.2rem] hover:bg-black-10">
          <div className="flex w-[21.8rem] gap-[0.8rem]">
            {icon}
            <span className="text-[1.6rem] font-bold text-black-40">
              {label}
            </span>
          </div>

          {label === '내팀' && (
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
          {isOpen && hasSubItems && (
            <motion.div
              key="content"
              // variants={dropdownVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="overflow-hidden"
            >
              {subItems.map((team) => (
                <button
                  key={team.id}
                  className="flex h-[4.4rem] w-full items-center rounded-[0.8rem] pl-[4.4rem] pr-[2.4rem] text-[1.4rem] font-medium text-black-60 hover:bg-hover-5 hover:text-black-80"
                >
                  {team.name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </>
  );
};

export default SidebarItem;
