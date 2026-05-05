import { useState } from 'react';

import { formatTeamCardCreatedAt } from '../../utils/kst-time';

import IcTeamCardCharacter from '../../assets/icons/image/ic_character_circle_primary_60.svg?react';

import IcPersons from '../../assets/icons/normal/ic_persons.svg?react';
import IcDesktop from '../../assets/icons/normal/ic_desktop.svg?react';
import IcCompany from '../../assets/icons/normal/ic_company.svg?react';

import BaseTag from '../common/Tag';

import IcChevronRight from '../../assets/icons/normal/chevron/ic_chevronRight.svg?react';

interface TeamCardProps {
  teamImageUrl?: string;
  title?: string;
  memberCount?: number;
  workMode?: string;
  createdAt?: string;
  description?: string;
  onClick?: () => void;
}

const toWorkModeLabel = (workMode?: string): string => {
  if (workMode === 'ONLINE') {
    return '온라인';
  }

  if (workMode === 'OFFLINE') {
    return '오프라인';
  }

  if (workMode === 'HYBRID') {
    return '온라인 + 오프라인';
  }

  return workMode ?? '';
};

const TeamCard = ({
  title = 'TeamCardTitle',
  teamImageUrl,
  memberCount,
  workMode,
  createdAt,
  description,
  onClick,
}: TeamCardProps) => {
  const [imageError, setImageError] = useState(false);
  const workModeLabel = toWorkModeLabel(workMode);
  const createdAtLabel = createdAt ? formatTeamCardCreatedAt(createdAt) : '';

  const metaTags = [
    { icon: <IcPersons className="h-[1.2rem] w-[1.2rem]" />, label: memberCount },
    { icon: <IcDesktop className="h-[1.2rem] w-[1.2rem]" />, label: workModeLabel },
    { icon: <IcCompany className="h-[1.2rem] w-[1.2rem]" />, label: createdAtLabel },
  ];

  return (
    <div
      className="flex w-[68.8rem] items-center gap-[2.4rem] rounded-[1rem] border border-solid border-black-30 bg-black-5 p-[1.6rem] hover:cursor-pointer hover:bg-hover-5"
      onClick={onClick}
    >
      {/** 팀 이미지 */}
      <div className="relative flex aspect-[40/21] w-[15.4rem] flex-shrink-0 flex-col items-center justify-center gap-[1rem] self-stretch rounded-[1rem] bg-blue-5 py-[1.9rem]">
        {teamImageUrl && !imageError ? (
          <img
            alt={'팀 대표 이미지'}
            src={teamImageUrl}
            className="absolute inset-0 h-full w-full rounded-[1rem] object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <IcTeamCardCharacter className="h-[11.6rem] w-[11.6rem]" />
        )}
      </div>
      {/** 팀 설명 */}
      <div className="flex min-w-0 flex-1 flex-col items-start gap-[2.4rem] self-stretch py-[0.8rem] pr-[2rem]">
        <div className="flex h-[6rem] flex-col items-start gap-[0.8rem]">
          <h2 className="text-[2.4rem] font-[600] leading-[1.5] tracking-[-0.048rem] text-black">
            {title}
          </h2>
          <div className="flex items-start gap-[0.4rem]">
            {metaTags.map(({ icon, label }, i) => (
              <BaseTag key={i} size="xs" shape="circle" color="black80" isInverted leftIcon={icon} className="min-w-[2.8rem]">
                {label}
              </BaseTag>
            ))}
          </div>
        </div>
        <div className="self-stretch overflow-hidden">
          <p className="line-clamp-3 block h-[5.4rem] overflow-hidden text-ellipsis break-words text-[1.2rem] font-[500] leading-[1.5] tracking-[-0.024rem] text-black">
            {description}
          </p>
        </div>
      </div>
      <IcChevronRight className="h-[2.4rem] w-[2.4rem] text-black-70" />
    </div>
  );
};

export default TeamCard;
