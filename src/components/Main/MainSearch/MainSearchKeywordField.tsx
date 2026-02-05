import IcSearch from '../../../../src/assets/icons/normal/ic_normal_search.svg?react';

/**
 * MainSearch: 검색어(Keyword) 입력 컴포넌트
 */

type MainSearchKeywordFieldProps = {
  value: string;
  onChange: (v: string) => void;
  onFocus: () => void;
};

const MainSearchKeywordField = ({
  value,
  onChange,
  onFocus,
}: MainSearchKeywordFieldProps) => {
  const hasValue = value.trim().length > 0;

  return (
    <div className="flex h-[5rem] flex-1 items-center gap-[1rem] border-y border-r border-solid border-[#B7B9C0] px-[2rem]">
      <div className="flex h-[2rem] w-[2rem] flex-col items-center justify-center">
        <IcSearch className="text-[#878B96]" />
      </div>
      <input
        type="text"
        className={`w-full text-[1.6rem] font-[600] outline-none ${
          hasValue ? 'text-[#023075]' : 'text-[#878B96]'
        }`}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        value={value}
        placeholder="검색어를 입력해주세요."
      />
    </div>
  );
};

export default MainSearchKeywordField;
