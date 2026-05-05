import { useMemo } from 'react';

import MainCardTag from './MainCardTag';
import { SkillIconLarge } from '../../../../utils/SkillIcon';
import { toSkillLabel } from '../../../../utils/skill';
import { POSITION_CONVERTER } from '../../../../utils/position';

import MeatBallIcon from '../../../../assets/icons/skill/large/ic_skill_meatball_large.svg?react';

/**
 * Main Components: MainCard
 * 1. 해당 MainCard는 MainPage와 TeamHomePage에서 사용하는 MainCard입니다.
 *  1-1. variant로 main, team 을 구분했습니다.
 */

const toPositionLabel = (value: string): string => {
  const trimmed = (value || '').trim();
  return POSITION_CONVERTER[trimmed] || trimmed;
};

interface MainCardProps {
  mainCardTitle?: string;
  mainCardPositions?: string[];
  mainCardSkills?: string[];
  mainCardCreatedAt?: string;
  variant?: 'main' | 'team';
  className?: string;
  isActive?: boolean;
  isClosed?: boolean;
  onClick?: () => void;
}

const MainCard = ({
  mainCardTitle,
  mainCardPositions,
  mainCardSkills,
  variant = 'main',
  isActive = false,
  isClosed = false,
  mainCardCreatedAt,
  className,
  onClick,
}: MainCardProps) => {
  const baseStyle =
    'pointer-events-auto flex w-full cursor-pointer flex-col items-start gap-[3.2rem] rounded-[1.2rem] border border-solid border-[#E7E8EA] bg-white px-[2.8rem] py-[2.4rem]';
  const hoverStyle =
    variant === 'main' ? 'hover:shadow-main-card' : 'hover:bg-hover-5';
  const activeStyle = isActive ? 'border-blue-70' : '';
  const closedStyle = isClosed ? 'opacity-50' : '';

  const uniquePositions = useMemo(() => {
    const list = (mainCardPositions || [])
      .map((j) => (j || '').trim())
      .filter(Boolean);

    return Array.from(new Set(list));
  }, [mainCardPositions]);

  return (
    <button
      type="button"
      data-main-card="true"
      className={`${baseStyle} ${hoverStyle} ${activeStyle} ${closedStyle} ${className}`}
      onClick={onClick}
    >
      {/** Frame 01 */}
      <div className="flex h-[9rem] flex-col items-start gap-[1.6rem] self-stretch">
        {/** MainCard Title */}
        <div className="flex h-[4.8rem] max-h-[4.8rem] flex-shrink-0 items-start gap-[1.2rem] self-stretch overflow-hidden overflow-ellipsis">
          <span className="line-clamp-2 leading-[1.5] tracking-[-0.032rem] overflow-hidden text-left text-ellipsis text-[1.6rem] font-[600] text-[#0E0E0E]">
            {mainCardTitle}
          </span>
        </div>
        {/** MainCard Job Tag */}
        <div className="flex flex-wrap content-start items-start gap-[0.4rem] self-stretch">
          {uniquePositions.slice(0, 3).map((position) => (
            <MainCardTag key={position} TagTitle={toPositionLabel(position)} />
          ))}
          {uniquePositions.length > 3 ? <MeatBallIcon /> : null}
        </div>
      </div>

      {/** Frame 02 */}
      <div className="flex flex-col items-start gap-[0.4rem] self-stretch">
        {/* card-skill-box */}
        <div className="flex h-[2.8rem] items-center gap-[0.6rem] self-stretch">
          <div className="flex items-center gap-[0.6rem]">
            {(mainCardSkills || []).slice(0, 5).map((skill, index) => {
              const enumValue = (skill || '').trim();
              const iconName = toSkillLabel(enumValue);

              return (
                <SkillIconLarge
                  key={`${enumValue}-${iconName}-${index}`}
                  name={iconName}
                  className="w-[2.8rem]"
                />
              );
            })}
            {(mainCardSkills || []).length > 5 ? <MeatBallIcon /> : null}
          </div>
        </div>
        {/* Time */}
        <div className="flex w-full justify-end">
          <span className="text-[1.2rem] font-[500] text-[#878B96]">
            {mainCardCreatedAt}
          </span>
        </div>
      </div>
    </button>
  );
};

export default MainCard;
