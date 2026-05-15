import { useEffect, useState } from 'react';

import type { PostDetailResponse } from '../../types/api/posts';

import { useDeletePost, usePatchPostClose } from '../../hooks/usePost';

import TeamPostStatusToggle from './TeamPostStatusToggle';
import CustomBtn from '../common/Button/index';

import IcVertiCalBar from '../../assets/icons/ic_vertical_bar.svg?react';
import IcSkillMeatball from '../../assets/icons/skill/large/ic_skill_meatball_large.svg?react';

import { formatKstYyMmDd } from '../../utils/kst-time';
import { POSITION_CONVERTER } from '../../utils/position';
import { toSkillLabel } from '../../utils/skill';
import { SkillIconLarge } from '../../utils/SkillIcon';

const TeamPostItem = ({
  id,
  title,
  recruitments,
  applicantCount,
  createdAt,
  recruiting,
  teamId,
  onClick,
}: PostDetailResponse & { teamId: number; onClick?: () => void }) => {
  const [isClosed, setIsClosed] = useState(!recruiting);
  const { mutate: patchClose, isPending: isClosePending } = usePatchPostClose();
  const { mutate: deletePost, isPending: isDeletePending } = useDeletePost(teamId);

  useEffect(() => {
    setIsClosed(!recruiting);
  }, [recruiting]);

  const roles = recruitments
    .map((r) => POSITION_CONVERTER[r.position] ?? r.position)
    .join(' · ');
  const skills = [...new Set(recruitments.flatMap((r) => r.skills ?? []))]
    .map(toSkillLabel)
    .filter(Boolean);

  return (
    <div className="flex items-start justify-between gap-[clamp(2rem,_calc(2.917vw_-_1.2rem),_4.4rem)] self-stretch border-b border-solid border-black-30 py-[2.8rem]">
      {/** 토글을 제외한 모든 내용 */}
      <div className="flex min-w-0 flex-1 items-start gap-[5.2rem]">
        {/** 날짜 */}
        <div className="flex items-center justify-center gap-[1rem] py-[0.3rem]">
          <span
            className={`text-[1.4rem] font-[500] leading-[1.5] tracking-[-0.028rem] ${isClosed ? 'text-black-40' : 'text-black-70'}`}
          >
            {createdAt ? formatKstYyMmDd(createdAt) : ''}
          </span>
        </div>
        {/** 그외 */}
        <div className="flex min-w-0 flex-1 items-start gap-[clamp(8rem,_calc(4.167vw_+_2rem),_10rem)]">
          <div
            className="flex min-w-0 flex-1 cursor-pointer flex-col items-start gap-[1rem]"
            onClick={onClick}
          >
            <span
              className={`max-w-[clamp(35rem,_calc(39.583vw_-_22rem),_54rem)] overflow-hidden text-ellipsis whitespace-nowrap text-[1.8rem] font-[600] ${isClosed ? 'text-black-40' : 'text-black-100'}`}
            >
              {title}
            </span>
            <div className="flex flex-wrap content-center items-center gap-[1.2rem] self-stretch">
              <span
                className={`text-[1.4rem] font-[500] leading-[1.5] tracking-[-0.028rem] ${isClosed ? 'text-black-40' : 'text-black-90'}`}
              >
                모집 직무
              </span>
              <IcVertiCalBar />
              <span
                className={`text-[1.4rem] font-[500] leading-[1.5] tracking-[-0.028rem] ${isClosed ? 'text-black-40' : 'text-black-90'}`}
              >
                {roles}
              </span>
            </div>
          </div>
          <div className="flex w-[28rem] items-start gap-[clamp(6rem,_calc(6.25vw_-_3rem),_9rem)]">
            <div className="flex flex-shrink-0 content-start items-start pt-[0.1rem]">
              <div className="flex w-[clamp(12rem,_calc(2.5vw_+_8.4rem),_13.2rem)] flex-shrink-0 content-center items-center gap-[0.8rem]">
                {skills.slice(0, 3).map((skill, index) => (
                  <SkillIconLarge
                    key={index}
                    name={skill}
                    className="aspect-[1/1] h-[2.4rem] w-[2.4rem]"
                  />
                ))}
                {skills.length > 3 && (
                  <IcSkillMeatball className="aspect-[1/1] h-[2.4rem] w-[2.4rem]" />
                )}
              </div>
            </div>
            <div className="flex w-[5.8rem] flex-shrink-0 flex-col items-center justify-center gap-[1rem]">
              <span
                className={`decoration-skip-ink-auto overflow-hidden text-ellipsis text-[1.8rem] font-[700] leading-[1.5] tracking-[-0.036rem] underline decoration-solid decoration-auto underline-offset-auto [text-underline-position:from-font] ${isClosed ? 'text-black-40' : 'text-blue-100'}`}
              >
                {applicantCount}명
              </span>
              <span
                className={`flex-shrink-0 self-stretch text-center text-[1.4rem] font-[500] leading-[1.5] tracking-[-0.028rem] ${isClosed ? 'text-black-40' : 'text-black-90'}`}
              >
                지원자 수
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-[19.2rem] items-center gap-[0.6rem]">
        <CustomBtn
          size="sm"
          color="tertiary"
          disabled={isClosed || isClosePending}
          onClick={() => {
            if (isClosed || isClosePending) return;
            setIsClosed(true);
            patchClose(
              { postId: id, status: 'CLOSED' },
              { onError: () => setIsClosed(false) },
            );
          }}
        >
          모집 마감
        </CustomBtn>
        <CustomBtn
          size="sm"
          color="secondary"
          disabled={isDeletePending}
          onClick={() => deletePost(id)}
        >
          모집글 삭제
        </CustomBtn>
      </div>
    </div>
  );
};

export default TeamPostItem;
