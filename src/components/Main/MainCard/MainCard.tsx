import MainCardTag from './MainCardTag';

/* 임시 SkillIcon */
import SkillJava from '../../../assets/icons/skill/large/ic_skill_Java_large.svg?react';
import SkillFigma from '../../../assets/icons/skill/large/ic_skill_Figma_large.svg?react';
import SkillDjango from '../../../assets/icons/skill/large/ic_skill_Django_large.svg?react';
import SkillJavaScript from '../../../assets/icons/skill/large/ic_skill_JavaScript_large.svg?react';
import SkillTypescript from '../../../assets/icons/skill/large/ic_skill_TypeScript_large.svg?react';

import MeatBallIcon from '../../../assets/icons/skill/large/ic_skill_meatball_large.svg?react';

/**
 * Main Components: MainCard
 * 1. 해당 MainCard는 MainPage에서 사용하는 MainCard
 */

interface MainCardProps {
  MainCardTitle?: string;
}

const MainCard = ({ MainCardTitle }: MainCardProps) => {
  return (
    <div className="flex w-[36.8rem] min-w-[33.6rem] cursor-pointer flex-col items-start gap-[3.2rem] rounded-[1.2rem] border border-solid border-[#E7E8EA] bg-white px-[2.8rem] py-[2.4rem] hover:shadow-main-card">
      {/** Frame 01 */}
      <div className="flex h-[9rem] min-w-[28rem] flex-col items-start gap-[1.6rem] self-stretch">
        {/** MainCard Title */}
        <div className="flex h-[4.6rem] max-h-[4.6rem] flex-shrink-0 items-start gap-[1.2rem] self-stretch overflow-hidden overflow-ellipsis">
          <span className="line-clamp-2 overflow-hidden text-ellipsis text-[1.6rem] font-[600] text-[#0E0E0E]">
            {MainCardTitle}
          </span>
        </div>
        {/** MainCard Job Tag */}
        <div className="flex flex-wrap content-start items-start gap-[0.4rem] self-stretch">
          <MainCardTag TagTitle="프론트엔드" />
          <MainCardTag TagTitle="디자이너" />
          <MainCardTag TagTitle="백엔드" />
          <MeatBallIcon />
        </div>
      </div>

      {/** Frame 02 */}
      <div className="flex flex-col items-start gap-[0.4rem] self-stretch">
        {/* card-skill-box */}
        <div className="flex items-center gap-[0.6rem] self-stretch">
          <div className="flex items-center gap-[0.6rem]">
            <SkillJava />
            <SkillFigma />
            <SkillDjango />
            <SkillJavaScript />
            <SkillTypescript />
            <MeatBallIcon />
          </div>
        </div>
        {/* Time */}
        <div className="flex w-full justify-end">
          <span className="text-[#878B96]"> 24시간 전 </span>
        </div>
      </div>
    </div>
  );
};

export default MainCard;
