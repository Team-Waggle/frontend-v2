import { useEffect, useRef } from 'react';

import IcProfileBasic from '../assets/icons/ic_profile_basic.svg?react';

import IcPersons from '../assets/icons/normal/ic_persons.svg?react';
import IcFolder from '../assets/icons/normal/ic_folder.svg?react';

import IcJavaSkill from '../assets/icons/skill/large/ic_skill_Java_large.svg?react';
import IcFigmaSkill from '../assets/icons/skill/large/ic_skill_Figma_large.svg?react';
import IcDjSkill from '../assets/icons/skill/large/ic_skill_Django_large.svg?react';
import IcJavaScriptSkill from '../assets/icons/skill/large/ic_skill_JavaScript_large.svg?react';
import IcMongoSkill from '../assets/icons/skill/large/ic_skill_MongoDB_large.svg?react';
import IcNodejsSkill from '../assets/icons/skill/large/ic_skill_Node.js_large.svg?react';

import TeamCard from '../components/RecruitmentDetail/TeamCard';
import SideTeamCard from '../components/common/Cards/SideTeamCard';

import BaseButton from '../components/common/Button/index';

import ButtonBlur from '../assets/blur/recruitment_detail_button_blur.svg?react';

/** 하단 여백만 수정하면 퍼블리싱 작업 끝 */

const RecruitmentDetailPage = () => {
  const labelClassNameBase =
    'text-[1.4rem] font-[500] leading-[1.5] tracking-[-0.028rem] text-black-100';
  const labelClassNameNoWrap =
    'text-[1.4rem] font-[500] leading-[1.5] tracking-[-0.028rem] text-black-100 whitespace-nowrap';
  const valueClassName =
    'text-[1.4rem] font-[500] leading-[1.5] tracking-[0.028rem] text-blue-80';

  const apiCounts = {
    plan: 10,
    design: 10,
    frontend: 10,
    backend: 10,
    marketing: 10,
    etc: 10,
  } as const;

  type RoleKey = keyof typeof apiCounts;

  const roles: Array<{ key: RoleKey; label: string; noWrap?: boolean }> = [
    { key: 'plan', label: '기획' },
    { key: 'design', label: '디자인' },
    { key: 'frontend', label: '프론트엔드', noWrap: true },
    { key: 'backend', label: '백엔드' },
    { key: 'marketing', label: '마케팅' },
    { key: 'etc', label: '기타' },
  ];

  // sideTeamCard Scroll
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const sideWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const leftEl = leftColRef.current;
    const sideEl = sideWrapRef.current;

    if (!leftEl || !sideEl) return;

    const topOffsetPx = 112;

    let currentY = 0;
    let targetY = 0;
    let rafId: number | null = null;

    const clamp = (value: number, min: number, max: number) => {
      if (value < min) return min;
      if (value > max) return max;
      return value;
    };

    const calcTarget = () => {
      const scrollY = window.scrollY || window.pageYOffset;

      const leftRect = leftEl.getBoundingClientRect();
      const leftTop = leftRect.top + scrollY;
      const leftHeight = leftEl.offsetHeight;

      const sideHeight = sideEl.offsetHeight;

      const maxY = Math.max(0, leftHeight - sideHeight);
      const raw = scrollY + topOffsetPx - leftTop;

      targetY = clamp(raw, 0, maxY);
    };

    const tick = () => {
      const diff = targetY - currentY;

      if (Math.abs(diff) < 0.1) {
        currentY = targetY;
      } else {
        currentY += diff * 0.12;
      }

      sideEl.style.transform = `translate3d(0, ${currentY}px, 0)`;

      rafId = window.requestAnimationFrame(tick);
    };

    const onScroll = () => {
      calcTarget();
    };

    const onResize = () => {
      calcTarget();
    };

    calcTarget();
    rafId = window.requestAnimationFrame(tick);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);

      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div className="flex flex-1 items-start justify-center gap-[7.2rem] self-stretch pt-[11.2rem]">
      {/** 모집글 상세조회 구간 */}
      <div
        ref={leftColRef}
        className="flex w-[68.8rem] flex-col items-center gap-[6rem]"
      >
        {/** 모집글 상세조회 제목 및 핈수 정보 */}
        <div className="flex flex-col items-start gap-[1rem] self-stretch">
          <div className="flex flex-col items-start gap-[3.2rem] self-stretch">
            <div className="flex flex-col items-start gap-[2rem] self-stretch">
              <div className="overflow-hidden overflow-ellipsis">
                <span className="line-clamp-2 overflow-ellipsis text-[3.4rem] font-[600] leading-[1.5] tracking-[-0.068rem] text-black-100">
                  팀 dtdt에서 [팀 팀 빌딩 웹사이트]를 같이 제작할 프론트엔드
                  개발자`님을 찾습니다!! 모집글제목팀 dtdt에서 [팀 팀 빌딩
                  웹사이트]를 같이 제작할 프론트엔드 개발자`님을 찾습니다!!
                  모집글제목
                </span>
              </div>
              <div className="flex items-center gap-[0.8rem]">
                <div className="flex items-center gap-[0.8rem]">
                  <IcProfileBasic className="h-[2.4rem] w-[2.4rem]" />
                  <span className="text-[1.6rem] font-[600] leading-[1.5] tracking-[-0.032rem] text-black-100">
                    일이삼사오육칠팔구십
                  </span>
                </div>
                <div className="h-[1.7rem] w-[0.1rem] bg-black-40" />
                <span className="text-[1.6rem] font-[400] leading-[1.5] tracking-[-0.032rem] text-black-60">
                  24시간 전
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between self-stretch">
              {/** 왼쪽: 모집인원 */}
              <div className="flex w-[39.5rem] flex-col items-start gap-[1.6rem] rounded-[0.8rem] border border-solid border-black-30 px-[2.2rem] pb-[2.8rem] pt-[2rem]">
                <div className="flex items-center gap-[0.4rem]">
                  <IcPersons className="h-[1.6rem] w-[1.6rem] rounded-[0.4rem]" />
                  <span className="text-[1.3rem] font-[600] leading-[1.5] text-black-100">
                    모집 인원
                  </span>
                </div>
                <div className="inline-grid h-[6.2rem] gap-x-[48px] gap-y-[2rem] px-[1rem] [grid-template-columns:repeat(3,fit-content(100%))] [grid-template-rows:repeat(2,fit-content(100%))]">
                  {/** 모집인원 임시 데이터 */}
                  {roles.map((role) => {
                    const count =
                      typeof apiCounts?.[role.key] === 'number'
                        ? apiCounts[role.key]
                        : 0;

                    return (
                      <div
                        key={role.key}
                        className="flex items-center gap-[1rem] self-stretch"
                      >
                        <span
                          className={
                            role.noWrap
                              ? labelClassNameNoWrap
                              : labelClassNameBase
                          }
                        >
                          {role.label}
                        </span>
                        <span className={valueClassName}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/** 오른쪽: 사용스킬 */}
              <div className="flex h-[14.9rem] w-[27.9rem] flex-col items-start gap-[1.6rem] rounded-[0.8rem] border border-solid border-black-30 px-[2.2rem] pb-[2.8rem] pt-[2rem]">
                <div className="flex items-center gap-[0.4rem]">
                  <IcFolder className="h-[1.6rem] w-[1.6rem]" />
                  <span className="text-[1.3rem] font-[600] leading-[1.5] tracking-[-0.026rem] text-black-100">
                    사용스킬
                  </span>
                </div>
                <div className="inline-grid gap-x-[20px] gap-y-[2rem] self-stretch px-[1rem] [grid-template-columns:repeat(5,minmax(0,1fr))] [grid-template-rows:repeat(2,fit-content(100%))]">
                  <IcJavaSkill />
                  <IcFigmaSkill />
                  <IcDjSkill />
                  <IcJavaScriptSkill />
                  <IcMongoSkill />
                  <IcNodejsSkill />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/** 모집글 상세조회 내용 */}
        <div className="flex flex-col items-start gap-[4rem] self-stretch">
          <TeamCard />
          <div className="w-[68.8rem]">
            <span className="text-[1.6rem] font-[600] leading-[1.5] tracking-[-0.032rem] text-black-100">
              🐰 회사소개 – 위시버니(Wish Bunny) 위시버니는 국내 최대 공동구매
              일정 플랫폼으로, 공구 캘린더 및 공구 진행을 연결하는 이커머스 앱
              서비스입니다. 현재 신규 시스템 구축을 본격화하며, 팀 단위로 함께
              해주실 프런트엔드 개발자님을 모집합니다. 유저 니즈 기반으로 빠르게
              성장하고 있어, 본인의 역량이 실제 기능으로 반영되는 경험을 하실 수
              있습니다. 관심 있는 분들은 위시버니 앱을 직접 경험해보시고 편하게
              지원해주세요! 🙂 <br />
              <br />
              📍 서비스 링크
              <br />
              웹사이트: https://www.wishbunny.me/🐰 회사소개 – 위시버니(Wish
              Bunny)
              <br />
              위시버니는 국내 최대 공동구매 일정 플랫폼으로, 공구 캘린더 및 공구
              진행을 연결하는 이커머스 앱 서비스입니다. 현재 신규 시스템 구축을
              본격화하며, 팀 단위로 함께 해주실 프런트엔드 개발자님을
              모집합니다. <br />
              <br />
              유저 니즈 기반으로 빠르게 성장하고 있어, 본인의 역량이 실제
              기능으로 반영되는 경험을 하실 수 있습니다. 관심 있는 분들은
              위시버니 앱을 직접 경험해보시고 편하게 지원해주세요! 🙂
              <br />
              <br />
              📍 서비스 링크
              <br />
              웹사이트: https://www.wishbunny.me/🐰 회사소개 – 위시버니(Wish
              Bunny)
              <br />
              위시버니는 국내 최대 공동구매 일정 플랫폼으로, 공구 캘린더 및 공구
              진행을 연결하는 이커머스 앱 서비스입니다. 현재 신규 시스템 구축을
              본격화하며, 팀 단위로 함께 해주실 프런트엔드 개발자님을
              모집합니다. <br />
              <br />
              유저 니즈 기반으로 빠르게 성장하고 있어, 본인의 역량이 실제
              기능으로 반영되는 경험을 하실 수 있습니다. 관심 있는 분들은
              위시버니 앱을 직접 경험해보시고 편하게 지원해주세요! 🙂 <br />
              <br />
              📍 서비스 링크
              <br />
              웹사이트: https://www.wishbunny.me/
            </span>
            <br />
            <br />
          </div>
        </div>

        {/** 작성자 기준 화면: 마감하기, 수정하기 버튼 */}
        <div className="flex w-[32rem] items-start gap-[1.2rem] pb-[6.6rem] pt-[1.2rem]">
          <BaseButton size="lg" color="secondary" children="마감하기" />
          <BaseButton size="lg" color="primary" children="수정하기" />
        </div>
      </div>

      {/** 팀 구간 */}
      <div className="flex self-start pt-[17.8rem]">
        <div ref={sideWrapRef} className="self-start will-change-transform">
          <SideTeamCard variant="recruitment" />
        </div>
      </div>

      {/** 지원자 기준 화면: 지원하기 버튼 */}
      <div className="fixed bottom-[3.6rem] left-1/2 z-50 -translate-x-1/2">
        <div className="relative w-[32rem]">
          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2">
            <ButtonBlur className="h-[10rem] w-[40rem]" />
          </div>

          <BaseButton
            className="relative z-10 w-[32rem]"
            size="lg"
            color="primary"
          >
            지원하기
          </BaseButton>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentDetailPage;
