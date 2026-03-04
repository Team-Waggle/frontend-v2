import IcTeamCardCharacter from '../../assets/icons/image/ic_character_circle_primary_60.svg?react';

import IcPersons from '../../assets/icons/normal/ic_persons.svg?react';
import IcDesktop from '../../assets/icons/normal/ic_desktop.svg?react';
import IcCompany from '../../assets/icons/normal/ic_company.svg?react';

import IcChevronRight from '../../assets/icons/normal/chevron/ic_chevronRight.svg?react';

const TeamCard = () => {
  return (
    <div className="flex w-[68.8rem] items-center gap-[2.4rem] rounded-[1rem] border border-solid border-black-30 bg-black-5 p-[1.6rem] hover:cursor-pointer hover:bg-hover-5">
      {/** 팀 이미지 */}
      <div className="flex aspect-[40/21] w-[29.3333rem] flex-shrink-0 flex-col items-center justify-center gap-[1rem] self-stretch rounded-[1rem] bg-blue-5 py-[1.9rem]">
        <IcTeamCardCharacter className="h-[11.6rem] w-[11.6rem]" />
      </div>
      {/** 팀 설명 */}
      <div className="flex flex-1 flex-col items-start gap-[2.4rem] self-stretch py-[0.8rem] pr-[2rem]">
        <div className="flex h-[6rem] flex-col items-start gap-[0.8rem]">
          <span className="text-[2.4rem] font-[600] leading-[1.5] tracking-[-0.048rem] text-black">
            일이삼사오육칠팔구
          </span>
          <div className="flex items-start gap-[0.4rem]">
            <div className="flex h-[2rem] min-w-[2.8rem] items-center justify-center gap-[0.2rem] rounded-[9.9rem] bg-black-10 px-[0.8rem]">
              <IcPersons className="h-[1.2rem] w-[1.2rem]" />
              <span className="flex-1 text-[1rem] font-[500] leading-[1.5] tracking-[-0.02rem] text-black-100">
                100
              </span>
            </div>
            <div className="flex h-[2rem] min-w-[2.8rem] items-center justify-center gap-[0.2rem] rounded-[9.9rem] bg-black-10 px-[0.8rem]">
              <IcDesktop className="h-[1.2rem] w-[1.2rem]" />
              <span className="flex-1 text-[1rem] font-[500] leading-[1.5] tracking-[-0.02rem] text-black-100">
                온라인
              </span>
            </div>
            <div className="flex h-[2rem] min-w-[2.8rem] items-center justify-center gap-[0.2rem] rounded-[9.9rem] bg-black-10 px-[0.8rem]">
              <IcCompany className="h-[1.2rem] w-[1.2rem]" />
              <span className="flex-1 text-[1rem] font-[500] leading-[1.5] tracking-[-0.02rem] text-black-100">
                00.00.00
              </span>
            </div>
          </div>
        </div>
        <div className="self-stretch overflow-hidden">
          <span className="line-clamp-3 block h-[5.4rem] overflow-hidden text-ellipsis text-[1.2rem] font-[500] leading-[1.5] tracking-[-0.024rem] text-black">
            안녕하세요 :) 이번 팀에서는 우리 일상 속에서 당연하게 겪고 있던
            불편함을 조금 더 나은 방향으로 해결하고자 모였습니다. 팀 와글은
            사용자 경험을 최우선으로 생각하며, 창의적인 솔루션을 제안하고
            있습니다.
          </span>
        </div>
      </div>
      <IcChevronRight className="h-[2.4rem] w-[2.4rem] text-black-70" />
    </div>
  );
};

export default TeamCard;
