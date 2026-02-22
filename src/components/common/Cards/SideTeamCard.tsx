import { useState } from 'react';

import BaseButton from '../Button/index';

import IcCrown from '../../../assets/icons/tag/ic_crown.svg?react';
import IcShield from '../../../assets/icons/tag/ic_shield.svg?react';
import IcMe from '../../../assets/icons/tag/ic_me.svg?react';
import IcVertical from '../../../assets/icons/normal/ic_moreVertical_tight.svg?react';
import IcCharacter from '../../../assets/icons/image/ic_character_circle_gray_40.svg?react';

import { SkillIcon } from '../../../utils/SkillIcon';

interface SideTeamCardProps {
  title?: string;
  job?: string;
  variant?: 'team' | 'recruitment';
  isActvie?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const SideTeamCard = ({
  title = 'title',
  job = '프론트엔드',
  variant = 'team',
  isActvie = false,
  disabled = false,
  onClick,
}: SideTeamCardProps) => {
  const skills = ['Java', 'Figma', 'Node.js'];

  const baseStyle =
    'relative flex min-h-[27.2rem] w-[23.4rem] flex-col items-center gap-[2.4rem] rounded-[1.2rem] border border-solid border-black-30 bg-black-5 p-[2.8rem] cursor-pointer';

  // TeamHome에서만 사용하는 SideTeamCard Style (hover, active, disabled)
  const hoverStyle = 'hover:bg-black-20';
  const activeStyle = 'border-blue-70';
  const disabledStyle = 'bg-black-20';

  return (
    <div
      className={[
        baseStyle,
        variant === 'team' && !disabled && hoverStyle,
        isActvie && activeStyle,
        disabled && disabledStyle,
      ]
        .filter(Boolean)
        .join(' ')}
        onClick={onClick}
    >
      <div className="absolute flex w-[17.8rem] items-center justify-between">
        <div className="flex items-center gap-[0.4rem]">
          {variant === 'recruitment' && <IcCrown />}
          {variant === 'team' && (
            <>
              <IcCrown />
              {/* <IcShield /> */}
              {/* <IcMe /> */}
            </>
          )}
        </div>
        <div className="flex aspect-square h-[2.4rem] w-[2.4rem] flex-shrink-0 flex-col items-end justify-center gap-[1rem]">
          {variant === 'team' && (
            <IcVertical className="h-[2.4rem] text-black-50" />
          )}
        </div>
      </div>
      <div
        className={[
          'flex flex-col items-center self-stretch rounded-[0.6rem] pt-[1.2rem]',
          disabled && 'opacity-[0.4]',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="flex flex-col items-center gap-[1.7rem]">
          <IcCharacter className="h-[6.1rem] w-[6.1rem] rounded-[9.9rem]" />
          <div className="flex flex-col items-center gap-[0.4rem]">
            <span className="text-[1.6rem] font-[600] leading-[1.5] text-black-100">
              {title}
            </span>
            <span className="text-[1.4rem] font-[500] leading-[1.5] text-black-60">
              {job}
            </span>
          </div>
          <div className="flex items-start gap-[0.6rem]">
            {skills.map((skill) => (
              <div
                key={skill}
                className="flex aspect-square h-[3.2rem] w-[3.2rem] items-center justify-center gap-[1rem] rounded-[9.9rem] bg-black-10 p-[0.6rem]"
              >
                <SkillIcon name={skill} className="" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {variant === 'recruitment' && (
        <BaseButton size="md" color="secondary" children="문의하기" />
      )}

      {variant === 'team' && (
        <BaseButton size="md" color="tertiary" children="리뷰 쓰기" />
      )}
    </div>
  );
};

export default SideTeamCard;
