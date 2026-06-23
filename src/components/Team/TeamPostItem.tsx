import { useEffect, useState } from 'react';

import type { PostDetailResponse } from '../../types/api/posts';

import { useDeletePost, usePatchPostClose } from '../../hooks/usePost';

import CustomBtn from '../common/Button/index';

import IcVertiCalBar from '../../assets/icons/ic_vertical_bar.svg?react';
import IcSkillMeatball from '../../assets/icons/skill/large/ic_skill_meatball_large.svg?react';

import { formatKstYyyyMmDd } from '../../utils/kst-time';
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
    <div className="flex items-start justify-between gap-[clamp(2rem,_calc(2.917vw_-_1.2rem),_4.4rem)] self-stretch border-b border-solid border-black-30 py-[2.8rem] max-sm:flex-col max-sm:justify-start max-sm:gap-[3rem] max-sm:py-[1.6rem]">

      {/* 날짜 + 메인 콘텐츠 */}
      <div className="flex min-w-0 flex-1 items-start gap-[5.2rem] max-sm:w-full max-sm:flex-none max-sm:flex-col max-sm:gap-[1.2rem]">

        {/* 날짜 */}
        <div className="flex items-center justify-center gap-[1rem] py-[0.3rem]">
          <span
            className={`text-[1.4rem] font-[500] leading-[1.5] tracking-[-0.028rem] ${isClosed ? 'text-black-40' : 'text-black-70'}`}
          >
            {createdAt ? formatKstYyyyMmDd(createdAt) : ''}
          </span>
        </div>

        {/* 제목+직무 / 스킬+지원자수 */}
        <div className="flex min-w-0 flex-1 items-start gap-[clamp(8rem,_calc(4.167vw_+_2rem),_10rem)] max-sm:w-full max-sm:flex-none max-sm:flex-col max-sm:gap-[3.2rem]">

          {/* 제목 + 직무 */}
          <div
            className="flex min-w-0 flex-1 cursor-pointer flex-col items-start gap-[1rem] max-sm:gap-[0.8rem] max-sm:w-full max-sm:flex-none"
            onClick={onClick}
          >
            <span
              className={`max-w-[clamp(35rem,_calc(39.583vw_-_22rem),_54rem)] overflow-hidden text-ellipsis whitespace-nowrap text-[1.8rem] font-[600] max-sm:max-w-full ${isClosed ? 'text-black-40' : 'text-black-100'}`}
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

          {/* 스킬 아이콘 + 지원자수 */}
          <div className="flex w-[28rem] items-start gap-[clamp(6rem,_calc(6.25vw_-_3rem),_9rem)] max-sm:w-full max-sm:items-center max-sm:gap-[2.6rem]">

            {/* 스킬 아이콘 */}
            <div className="flex flex-shrink-0 content-start items-start pt-[0.1rem] max-sm:flex-1 max-sm:pt-0">
              <div className="flex w-[clamp(12rem,_calc(2.5vw_+_8.4rem),_13.2rem)] flex-shrink-0 content-center items-center gap-[0.8rem] max-sm:w-auto">
                {skills.slice(0, 3).map((skill, index) => (
                  <SkillIconLarge
                    key={index}
                    name={skill}
                    className="aspect-[1/1] h-[2.4rem] w-[2.4rem]"
                  />
                ))}
                {skills.length > 3 && (
                  <IcSkillMeatball className="aspect-[1/1] h-[2.4rem] w-[2.4rem] text-black-60" />
                )}
              </div>
            </div>

            {/* 지원자수 — 데스크탑: 세로(숫자↑ 라벨↓), 모바일: 가로(라벨 숫자) */}
            <div className="flex w-[5.8rem] flex-shrink-0 flex-col items-center justify-center gap-[1rem] max-sm:w-auto max-sm:flex-row max-sm:items-center max-sm:gap-[1rem]">
              <span
                className={`decoration-skip-ink-auto overflow-hidden text-ellipsis text-[1.8rem] font-[700] leading-[1.5] tracking-[-0.036rem] underline decoration-solid decoration-auto underline-offset-auto [text-underline-position:from-font] max-sm:order-2 ${isClosed ? 'text-black-40' : 'text-blue-100'}`}
              >
                {applicantCount}명
              </span>
              <span
                className={`flex-shrink-0 self-stretch text-center text-[1.4rem] font-[500] leading-[1.5] tracking-[-0.028rem] max-sm:order-1 max-sm:self-auto max-sm:text-left ${isClosed ? 'text-black-40' : 'text-black-90'}`}
              >
                지원자 수
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex w-[19.2rem] items-center self-stretch gap-[0.6rem] max-sm:w-auto">
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
          모집 글 삭제
        </CustomBtn>
      </div>
    </div>
  );
};

export default TeamPostItem;
