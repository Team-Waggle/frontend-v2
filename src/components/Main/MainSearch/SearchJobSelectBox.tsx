/**
 * MainSearch: 직무 필드 (Job Field) 클릭 시 뜨는 Select 박스
 */

type JobItemProps = {
  label: string;
  hasDivider?: boolean;
  rounded?: 'left' | 'right' | 'none';
  active?: boolean;
  onClick?: () => void;
};

const JobItem = ({
  label,
  hasDivider = true,
  rounded = 'none',
  active = false,
  onClick,
}: JobItemProps) => {
  const roundedStyle =
    rounded === 'left'
      ? 'rounded-l-[0.8rem]'
      : rounded === 'right'
        ? 'rounded-r-[0.8rem]'
        : '';

  const baseStyle =
    'flex w-[11.8rem] min-w-[11.8rem] items-center justify-center self-stretch px-[2.8rem]';

  const dividerStyle = hasDivider
    ? 'border border-y-0 border-l-0 border-solid border-[#E7E8EA]'
    : '';

  const stateStyle = active
    ? 'bg-[#F0F6FF] text-[#0E0E0F]'
    : 'text-[#51535A] hover:bg-[#F2F2F2] hover:text-[#51535A]';

  return (
    <button
      onClick={onClick}
      className={[baseStyle, stateStyle, dividerStyle, roundedStyle].join(' ')}
    >
      <span className="text-[1.4rem] font-[600]">{label}</span>
    </button>
  );
};

type SearchJobSelectBoxProps = {
  values: string[];
  onToggle: (label: string) => void;
};

const SearchJobSelectBox = ({ values, onToggle }: SearchJobSelectBoxProps) => {
  const jobs = ['기획', '디자인', '프론트엔드', '백엔드', '마케팅', '기타'];

  return (
    <div className="absolute left-0 top-[calc(5rem+0.8rem)] z-[20]">
      <div className="flex h-[4.8rem] max-w-[129.2rem] items-start overflow-hidden rounded-[0.8rem] border border-solid border-[#237BFF] bg-white shadow-search-select-box">
        {jobs.map((label, idx) => (
          <JobItem
            key={label}
            label={label}
            active={values.includes(label)}
            onClick={() => onToggle(label)}
            hasDivider={idx !== jobs.length - 1}
            rounded={
              idx === 0 ? 'left' : idx === jobs.length - 1 ? 'right' : 'none'
            }
          />
        ))}
      </div>
    </div>
  );
};

export default SearchJobSelectBox;
