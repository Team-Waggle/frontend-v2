import { Link } from 'react-router';

// Icons
import HomeFillIcon from '../../assets/icons/normal/ic_home_fill.svg?react';
import LogoIcon from '../../assets/icons/ic_logo.svg?react';
import ChevronDoubleRightIcon from '../../assets/icons/normal/chevron/ic_chevronDoubleRight.svg?react';
import ChevronDoubleLeftIcon from '../../assets/icons/normal/chevron/ic_chevronDoubleLeft.svg?react';

const SidebarLogo = ({
  isFolded,
  onToggle,
}: {
  isFolded: boolean;
  onToggle: () => void;
}) => {
  return (
    <div
      className={`relative flex h-[4.8rem] shrink-0 items-center gap-[1rem] px-[2rem] ${isFolded ? 'w-[8.8rem]' : 'w-[29.8rem]'}`}
    >
      {isFolded ? (
        <Link
          to="/"
          className="flex h-[4.8rem] w-[4.8rem] items-center justify-center rounded-[0.6rem] hover:bg-black-10"
        >
          <HomeFillIcon className="text-blue-80" />
        </Link>
      ) : (
        <div className="h-[2rem] w-[23.2rem]">
          <Link to="/">
            <LogoIcon className="text-blue-80" />
          </Link>
        </div>
      )}

      <button
        onClick={onToggle}
        className={`${
          isFolded
            ? 'absolute left-[7.3rem] top-[0.9rem] z-10 flex h-[3rem] w-[3rem] items-center justify-center rounded-full border border-solid border-black-20 hover:bg-black-20'
            : 'h-[1.6rem] w-[1.6rem]'
        }`}
      >
        {isFolded ? (
          <ChevronDoubleRightIcon className="h-[1.6rem] w-[1.6rem] text-black-60" />
        ) : (
          <ChevronDoubleLeftIcon className="h-[1.6rem] w-[1.6rem] text-black-60" />
        )}
      </button>
    </div>
  );
};

export default SidebarLogo;
