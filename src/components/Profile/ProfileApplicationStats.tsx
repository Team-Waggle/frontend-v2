import type { ApplicationStat } from '../../types/api/user';

interface ProfileApplicationStatsProps {
  stats: Record<ApplicationStat, number>;
  activeFilter: ApplicationStat;
  onFilterChange: (filter: ApplicationStat) => void;
}

const STAT_LABELS: ApplicationStat[] = ['전체', '검토중', '합류확정', '불합격'];

const ProfileApplicationStats = ({ stats, activeFilter, onFilterChange }: ProfileApplicationStatsProps) => {
  return (
    <div className="flex items-center self-stretch rounded-[2rem] border border-solid border-black-30 bg-black-5 px-[1.2rem] py-[2rem] max-sm:rounded-[1.2rem] max-sm:py-[1.2rem] max-xs:px-[0.8rem]">
      {STAT_LABELS.map((label, i) => (
        <div
          key={label}
          className={`flex flex-1 flex-col items-center justify-center self-stretch px-[1rem] max-sm:px-[0.4rem] ${i < STAT_LABELS.length - 1 ? 'border-r border-solid border-black-20' : ''}`}
        >
          <button
            type="button"
            className="flex w-full flex-col items-center self-stretch rounded-[1.2rem] px-[3rem] py-[2.6rem] hover:bg-black-10 max-sm:px-[0.4rem] max-sm:py-[1rem]"
            onClick={() => onFilterChange(label)}
          >
            <span className={`whitespace-nowrap text-[1.6rem] font-[600] leading-[150%] tracking-[-0.032rem] ${activeFilter === label ? 'text-blue-80' : 'text-black-100'}`}>
              {label}
            </span>
            <h3 className={`self-stretch text-center text-[2.8rem] font-[600] leading-[1.5] tracking-[-0.056rem] ${activeFilter === label ? 'text-blue-80' : 'text-black-100'}`}>
              {stats[label]}
            </h3>
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProfileApplicationStats;
