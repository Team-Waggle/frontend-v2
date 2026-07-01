import { useState } from 'react';

import IcSearch from '../../../../src/assets/icons/normal/ic_normal_search.svg?react';

/**
 * MainSearch: 검색어(Keyword) 입력 컴포넌트
 */

type MainSearchKeywordFieldProps = {
  value: string;
  onChange: (v: string) => void;
  onFocus?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  rounded?: boolean;
  placeholder?: string;
};

const MainSearchKeywordField = ({
  value,
  onChange,
  onFocus,
  onKeyDown,
  rounded = false,
  placeholder = '검색어를 입력해주세요.',
}: MainSearchKeywordFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.trim().length > 0;
  const isActive = hasValue || isFocused;
  const borderColorClass = isActive ? 'border-[#237BFF]' : 'border-[#B7B9C0]';
  const textColorClass = isFocused
    ? 'text-black-80 placeholder:text-black-80'
    : hasValue
      ? 'text-[#023075]'
      : 'text-black-60 placeholder:text-black-60';
  const containerClass = rounded
    ? `flex h-[5rem] flex-1 items-center gap-[1rem] rounded-[0.8rem] border border-solid px-[2rem] min-w-0 ${borderColorClass}`
    : `flex h-[5rem] flex-1 items-center gap-[1rem] border-y border-r border-solid px-[2rem] min-w-0 ${borderColorClass}`;

  return (
    <div className={containerClass}>
      <div className="flex h-[2rem] w-[2rem] flex-col items-center justify-center">
        <IcSearch className="text-black-60" />
      </div>
      <input
        type="text"
        className={`w-full text-[1.6rem] font-[600] outline-none ${textColorClass}`}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          setIsFocused(true);
          onFocus?.();
        }}
        onBlur={() => setIsFocused(false)}
        onKeyDown={onKeyDown}
        value={value}
        placeholder={placeholder}
      />
    </div>
  );
};

export default MainSearchKeywordField;
