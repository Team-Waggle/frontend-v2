import { useEffect, useRef, useState } from 'react';

import type { PostsSort } from '../../../types/api/posts';

import IcChevronDown from '../../../assets/icons/normal/chevron/ic_chevronDown.svg?react';
import IcChevronUp from '../../../assets/icons/normal/chevron/ic_chevronUp.svg?react';

/**
 * MainSearch: 모집글 정렬 Select Box
 */

type MainSearchSelectTextProps = {
  sort: PostsSort;
  onChangeSort: (sort: PostsSort) => void;
};

const SORT_OPTIONS: { value: PostsSort; label: string }[] = [
  { value: 'NEWEST', label: '최신순' },
  { value: 'OLDEST', label: '오래된순' },
  { value: 'MOST_VIEWED', label: '조회순' },
  { value: 'MOST_LIKED', label: '좋아요순' },
];

const MainSearchSelectText = ({
  sort,
  onChangeSort,
}: MainSearchSelectTextProps) => {
  const [open, setOpen] = useState(false);

  const wrapRef = useRef<HTMLDivElement | null>(null);

  const label = SORT_OPTIONS.find((option) => option.value === sort)?.label;

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
    <div
      ref={wrapRef}
      className="relative shrink-0"
      onKeyDown={(e) => {
        if (e.key === 'Escape') setOpen(false);
      }}
    >
      <button
        type="button"
        aria-label={`모집글 정렬: ${label}`}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-[4rem] w-[9.4rem] cursor-pointer items-center justify-between rounded-[0.4rem] bg-white pl-[1.2rem] pr-[1rem]"
      >
        <span className="text-[1.4rem] font-[500] text-[#0E0E0F]">{label}</span>
        {open ? (
          <IcChevronUp className="h-[1.6rem] w-[1.6rem] text-[#878B96]" />
        ) : (
          <IcChevronDown className="h-[1.6rem] w-[1.6rem] text-[#878B96]" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-20 flex w-[9.4rem] flex-col items-start justify-center rounded-[0.6rem] bg-white py-[0.6rem] shadow-search-select-box">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={sort === option.value}
              onClick={() => {
                onChangeSort(option.value);
                setOpen(false);
              }}
              className={`flex h-[3.2rem] w-full items-center px-[1rem] py-[0.2rem] text-left text-[1.3rem] text-[#0E0E0F] hover:bg-black-10 ${
                sort === option.value ? 'font-[500]' : 'font-[400]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MainSearchSelectText;
