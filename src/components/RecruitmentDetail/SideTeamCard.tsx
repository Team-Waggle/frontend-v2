import BaseButton from '../common/Button/index';

import IcCrown from '../../assets/icons/tag/ic_crown.svg?react';
import IcCharacter from '../../assets/icons/image/ic_character_circle_gray_40.svg?react';

import IcJavaSkill from '../../assets/icons/skill/large/ic_skill_Java_large.svg?react';

const SideTeamCard = () => {
  return (
    <div className="relative flex min-h-[27.2rem] w-[23.4rem] flex-col items-center gap-[2.4rem] rounded-[1.2rem] border border-solid border-black-30 bg-black-5 p-[2.8rem]">
      <div className="absolute flex w-[17.8rem] items-center justify-between">
        <div className="flex items-center gap-[0.4rem]">
          <IcCrown />
        </div>
      </div>
      <div className="flex flex-col items-center self-stretch rounded-[0.6rem] pt-[1.2rem]">
        <div className="flex flex-col items-center gap-[1.7rem]">
          <IcCharacter className="h-[6.1rem] w-[6.1rem] rounded-[9.9rem]" />
          <div className="flex flex-col items-center gap-[0.4rem]">
            <span className="text-[1.6rem] font-[600] leading-[1.5] text-black-100">
              일이삼사오육칠팔구십
            </span>
            <span className="text-[1.4rem] font-[500] leading-[1.5] text-black-60">
              프론트엔드
            </span>
          </div>
          <div className="flex items-start gap-[0.6rem]">
            <div className="flex aspect-square h-[3.2rem] w-[3.2rem] items-center justify-center gap-[1rem] rounded-[9.9rem] bg-black-10 p-[0.6rem]">
              <IcJavaSkill />
            </div>
            <div className="flex aspect-square h-[3.2rem] w-[3.2rem] items-center justify-center gap-[1rem] rounded-[9.9rem] bg-black-10 p-[0.6rem]">
              <IcJavaSkill />
            </div>
            <div className="flex aspect-square h-[3.2rem] w-[3.2rem] items-center justify-center gap-[1rem] rounded-[9.9rem] bg-black-10 p-[0.6rem]">
              <IcJavaSkill />
            </div>
          </div>
        </div>
      </div>
      <BaseButton size="md" color="secondary" children="문의하기" />
    </div>
  );
};

export default SideTeamCard;
