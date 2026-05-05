import { Link } from 'react-router';

// Icons
import WaggleWordmark from '../../assets/icons/waggle-wordmark.svg?react';
import WaggleLogoMark from '../../assets/icons/waggle-logo-mark.png';
import ChevronDoubleLeftIcon from '../../assets/icons/normal/chevron/ic_chevronDoubleLeft.svg?react';
import ChevronDoubleRightIcon from '../../assets/icons/normal/chevron/ic_chevronDoubleRight.svg?react';

const SidebarLogo = ({
  isFolded,
  onToggle,
}: {
  isFolded: boolean;
  onToggle: () => void;
}) => {
  return (
    <div
      className={`relative h-[6rem] shrink-0 transition-[width] duration-sidebar ease-sidebar ${isFolded ? 'w-[8.8rem]' : 'w-[29.8rem]'}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <Link
          to="/"
          className="absolute left-[1.6rem] top-1/2 flex h-[5.6rem] -translate-y-1/2 items-center gap-[0.4rem]"
        >
          <img
            src={WaggleLogoMark}
            alt="WAGGLE"
            className="h-[5.6rem] w-[5.6rem] shrink-0"
          />
          <span
            className={`flex h-[5.6rem] w-auto items-center transition-opacity duration-sidebar ease-sidebar ${
              isFolded ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <WaggleWordmark className="h-[5.6rem] w-auto" />
          </span>
        </Link>
      </div>

      <button
        onClick={onToggle}
        className="absolute right-[-1.5rem] top-[1.5rem] z-50 flex h-[3rem] w-[3rem] items-center justify-center rounded-full border border-solid border-black-20 bg-black-5 hover:bg-black-20"
      >
        <ChevronDoubleLeftIcon
          className={`absolute h-[1.6rem] w-[1.6rem] text-black-60 transition-opacity duration-sidebar ease-sidebar ${
            isFolded ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <ChevronDoubleRightIcon
          className={`absolute h-[1.6rem] w-[1.6rem] text-black-60 transition-opacity duration-sidebar ease-sidebar ${
            isFolded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </button>
    </div>
  );
};

export default SidebarLogo;
