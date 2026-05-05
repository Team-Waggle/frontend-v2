import { useEffect, useState } from 'react';

import type { PostDetailResponse } from '../../types/api/posts';

import { usePatchPostClose } from '../../hooks/usePost';

import TeamPostStatusToggle from './TeamPostStatusToggle';

import IcVertiCalBar from '../../assets/icons/ic_vertical_bar.svg?react';
import IcSkillMeatball from '../../assets/icons/skill/large/ic_skill_meatball_large.svg?react';

import { formatKstYyMmDd } from '../../utils/kst-time';
import { POSITION_CONVERTER } from '../../utils/position';
import { toSkillLabel } from '../../utils/skill';
import { SkillIconLarge } from '../../utils/SkillIcon';

const TeamPostItem = ({
  postId,
  title,
  recruitments,
  applicantCount,
  createdAt,
  isRecruiting,
  onClick,
}: PostDetailResponse & { onClick?: () => void }) => {
  const [isClosed, setIsClosed] = useState(!isRecruiting);
  const { mutate: patchClose, isPending } = usePatchPostClose();

  useEffect(() => {
    setIsClosed(!isRecruiting);
  }, [isRecruiting]);

  const roles = recruitments
    .map((r) => POSITION_CONVERTER[r.position] ?? r.position)
    .join(' · ');
  const skills = [...new Set(recruitments.flatMap((r) => r.skills ?? []))]
    .map(toSkillLabel)
    .filter(Boolean);

  return (
    <div className="@container flex items-start justify-between gap-[2rem] self-stretch border-b border-solid border-black-30 py-[2.8rem] @[80rem]:gap-[6rem]">
      {/** 토글을 제외한 모든 내용 */}
      <div className="flex min-w-0 flex-1 flex-col gap-[1.6rem] @[80rem]:flex-row @[80rem]:items-start @[80rem]:gap-[5.2rem]">
        {/** 날짜 */}
        <div className="flex items-center gap-[1rem] py-[0.3rem]">
          <span
            className={`text-[1.4rem] font-[500] leading-[1.5] tracking-[-0.028rem] ${isClosed ? 'text-black-40' : 'text-black-70'}`}
          >
            {createdAt ? formatKstYyMmDd(createdAt) : ''}
          </span>
        </div>
        {/** 제목/직무 + 스킬/지원자 */}
        <div className="flex min-w-0 flex-1 flex-col gap-[1.6rem] @[80rem]:flex-row @[80rem]:items-start @[80rem]:gap-[6rem]">
          <div
            className="flex min-w-0 flex-1 cursor-pointer flex-col items-start gap-[1rem]"
            onClick={onClick}
          >
            <span
              className={`w-full overflow-hidden text-ellipsis whitespace-nowrap text-[1.8rem] font-[600] ${isClosed ? 'text-black-40' : 'text-black-100'}`}
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
          <div className="flex shrink-0 items-start justify-between gap-[4rem] @[80rem]:w-[28rem] @[80rem]:justify-start @[80rem]:gap-[6rem]">
            <div className="flex flex-shrink-0 content-start items-start pt-[0.1rem]">
              <div className="flex flex-shrink-0 content-center items-center gap-[0.8rem]">
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
      <div className="shrink-0">
        <TeamPostStatusToggle
          isClosed={isClosed}
          onClick={() => {
            if (isPending) return;
            const newStatus = isClosed ? 'RECRUITING' : 'CLOSED';
            setIsClosed(!isClosed);
            patchClose(
              { postId, status: newStatus },
              { onError: () => setIsClosed((prev) => !prev) },
            );
          }}
        />
      </div>
    </div>
  );
};

export default TeamPostItem;
