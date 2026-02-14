import { useEffect, useRef, useState } from 'react';

import IcSearch from '../../../../src/assets/icons/normal/ic_search.svg?react';

/**
 * MainSearch: 검색어(Keyword) 입력 컴포넌트 오버레이 (전체적으로 뜨는 검색창)
 */

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
};

export default function SearchKeywordOverlay({
  value,
  onChange,
  onSearch,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();

    const t = window.setTimeout(() => setOpen(true), 0);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="absolute left-0 top-0 z-[30] flex h-[5rem] w-[129.2rem] items-start">
      <div
        className={[
          'flex flex-1 items-center gap-[1rem] self-stretch rounded-l-[0.8rem] border border-solid border-[#237BFF] bg-white px-[2rem]',
          'origin-right transition-transform duration-200 ease-out',
          open ? 'scale-x-100' : 'scale-x-0',
        ].join(' ')}
      >
        <div className="flex h-[2rem] w-[2rem] flex-col items-center justify-center">
          <IcSearch className="text-[#237BFF]" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-[1.6rem] font-[600] text-[#51535A] outline-none placeholder:text-[#51535A]"
          placeholder="검색어를 입력해주세요."
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSearch();
          }}
        />
      </div>
    </div>
  );
}
