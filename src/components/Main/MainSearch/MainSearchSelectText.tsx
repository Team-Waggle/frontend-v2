import { useEffect, useRef, useState } from 'react';

import type { PostsSort } from '../../../types/api/posts';

import IcChevronDown from '../../../assets/icons/normal/chevron/ic_chevronDown.svg?react';
import IcChevronUp from '../../../assets/icons/normal/chevron/ic_chevronUp.svg?react';

/**
 * MainSearch: 오래된순, 최신순 Select Box
 */

type MainSearchSelectTextProps = {
  sort: PostsSort;
  onChangeSort: (sort: PostsSort) => void;
};

const MainSearchSelectText = ({
  sort,
  onChangeSort,
}: MainSearchSelectTextProps) => {
  const [open, setOpen] = useState(false);

  const wrapRef = useRef<HTMLDivElement | null>(null);

  const label = sort === 'NEWEST' ? '최신순' : '오래된순';
  const optionLabel = sort === 'NEWEST' ? '오래된순' : '최신순';
  const nextSort: PostsSort = sort === 'NEWEST' ? 'OLDEST' : 'NEWEST';

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!wrapRef.current) {
        return;
      }

      if (!wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onMouseDown);

    return () => {
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-[4rem] w-[9.4rem] cursor-pointer items-center justify-between rounded-[0.4rem] bg-white pl-[1.2rem] pr-[1rem]"
      >
        <span className="text-[1.4rem] font-[500] text-[#0E0E0F]">{label}</span>
        {open ? (
          <IcChevronUp className="h-[1.6rem] w-[1.6rem] text-[#878B96]" />
        ) : (
          <IcChevronDown className="h-[1.6rem] w-[1.6rem] text-[#878B96]" />
        )}
      </div>

      {open && (
        <div
          onClick={() => {
            onChangeSort(nextSort);
            setOpen(false);
          }}
          className="absolute flex w-[9.4rem] cursor-pointer flex-col items-start justify-center rounded-[0.6rem] bg-white py-[0.6rem] shadow-search-select-box"
        >
          <div className="flex h-[3.2rem] w-[9.4rem] items-center gap-[1rem] px-[1rem] py-[0.2rem]">
            <span className="text-[1.3rem] font-[400] text-[#0E0E0F]">
              {optionLabel}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainSearchSelectText;
