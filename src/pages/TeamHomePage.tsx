import { useState, useRef, useEffect } from 'react';

import TeamDefaultImg from '../assets/icons/image/ic_character_circle_primary_60.svg?react';

import IcPersons from '../assets/icons/normal/ic_persons.svg?react';
import IcDesktop from '../assets/icons/normal/ic_desktop.svg?react';
import IcCompany from '../assets/icons/normal/ic_company.svg?react';

import ChevronLeft from '../assets/icons/normal/chevron/ic_chevronLeft.svg?react';
import ChevronRight from '../assets/icons/normal/chevron/ic_chevronRight.svg?react';

import MainCard from '../components/common/Cards/MainCard/MainCard';
import SideTeamCard from '../components/common/Cards/SideTeamCard';
import IconWrapper from '../components/common/IconWrapper';

const TeamHomePage = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [activeTeamMember, setActiveTeamMember] = useState<number | null>(null);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const posts = [
    {
      id: 1,
      title:
        '와글팀모집글조회입니다.와글팀모집글조회입니다.와글팀모집글조회입니다.와글팀모집글조회입니다.',
    },
    {
      id: 2,
      title:
        '와글팀모집글조회입니다.와글팀모집글조회입니다.와글팀모집글조회입니다.와글팀모집글조회입니다.',
    },
    {
      id: 3,
      title:
        '와글팀모집글조회입니다.와글팀모집글조회입니다.와글팀모집글조회입니다.와글팀모집글조회입니다.',
    },
    {
      id: 4,
      title:
        '와글팀모집글조회입니다.와글팀모집글조회입니다.와글팀모집글조회입니다.와글팀모집글조회입니다.',
    },
  ];

  const members = [
    { id: 1, title: 'title1', job: '프론트엔드' },
    { id: 2, title: 'title2', job: '프론트엔드' },
    { id: 3, title: 'title3', job: '프론트엔드' },
    { id: 4, title: 'title4', job: '프론트엔드' },
    { id: 5, title: 'title5', job: '프론트엔드' },
  ];

  const updateScrollButtons = () => {
    const el = trackRef.current;
    if (!el) return;

    const threshold = 1;
    const left = el.scrollLeft;
    const maxLeft = el.scrollWidth - el.clientWidth;

    setCanScrollLeft(left > threshold);
    setCanScrollRight(maxLeft - left > threshold);
  };

  useEffect(() => {
    updateScrollButtons();
  }, [posts.length]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const handleScroll = () => {
      updateScrollButtons();
    };

    const handleResize = () => {
      updateScrollButtons();
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    updateScrollButtons();

    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const scrollByCard = (direction: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;

    const firstCard = el.querySelector<HTMLElement>('[data-main-card="true"]');
    const cardWidth = firstCard ? firstCard.offsetWidth : 0;

    const gap = 18;
    const step = cardWidth > 0 ? cardWidth + gap : el.clientWidth;

    el.scrollBy({
      left: direction === 'right' ? step : -step,
      behavior: 'smooth',
    });
  };

  return (
    <div className="flex flex-1 flex-col items-center gap-[6rem] self-stretch pt-[9.2rem]">
      <div className="max-1440:w-[98.2rem] flex w-[130rem] flex-col items-start gap-[4rem]">
        {/** 팀 설명 */}
        <div className="flex items-start gap-[4rem] self-stretch">
          {/** 팀 이미지: default 값 */}
          <div className="max-1440:w-[42.4762rem] flex aspect-[40/21] w-[37.3333rem] flex-col items-center justify-center gap-[1rem] self-stretch rounded-[1rem] bg-blue-5 py-[1.9rem]">
            <TeamDefaultImg className="h-[15.8rem] w-[15.8rem]" />
          </div>
          {/** 팀 상세 내용 */}
          <div className="flex flex-1 flex-col items-start gap-[2.4rem]">
            <div className="flex flex-col items-start justify-center gap-[1.9rem]">
              {/** 팀명 */}
              <div>
                <span className="text-[3.8rem] font-[600] leading-[1.5] tracking-[-0.076rem] text-black">
                  일이삼사오육칠팔구
                </span>
              </div>
              {/** 팀원 수, 오프라인/온라인, 날짜 */}
              <div className="flex items-start gap-[0.8rem]">
                <div className="flex h-[4.2rem] min-w-[4.8rem] items-center justify-center gap-[0.2rem] rounded-[9.9rem] bg-black-10 px-[1.4rem]">
                  <IcPersons className="h-[1.2rem] w-[1.2rem]" />
                  <span className="flex-1 text-[1.8rem] font-[500] leading-[1.5] tracking-[-0.036rem] text-black-100">
                    100
                  </span>
                </div>
                <div className="flex h-[4.2rem] min-w-[4.8rem] items-center justify-center gap-[0.2rem] rounded-[9.9rem] bg-black-10 px-[1.4rem]">
                  <IcDesktop className="h-[1.2rem] w-[1.2rem]" />
                  <span className="flex-1 text-[1.8rem] font-[500] leading-[1.5] tracking-[-0.036rem] text-black-100">
                    온라인
                  </span>
                </div>
                <div className="flex h-[4.2rem] min-w-[4.8rem] items-center justify-center gap-[0.2rem] rounded-[9.9rem] bg-black-10 px-[1.4rem]">
                  <IcCompany className="h-[1.2rem] w-[1.2rem]" />
                  <span className="flex-1 text-[1.8rem] font-[500] leading-[1.5] tracking-[-0.036rem] text-black-100">
                    00.00.00
                  </span>
                </div>
              </div>
            </div>
            <div>
              <span className="text-[1.8rem] font-[500] leading-[1.5] tracking-[-0.036rem] text-black">
                안녕하세요 :) 이번 팀에서는 우리 일상 속에서 당연하게 겪고 있던
                불편함을 조금 더 나은 방향으로 해결하고자 모였습니다. 팀 와글은
                사용자 경험을 최우선으로 생각하며, 창의적인 솔루션을 제안하고
                있습니다.
              </span>
            </div>
          </div>
        </div>
        {/** 팀 모집글 / 팀원 관리 */}
        <div className="flex flex-col items-start gap-[3.6rem] self-stretch">
          {/** 모집글 */}
          <div className="flex flex-col items-start gap-[1.6rem] self-stretch">
            {/** 모집글 타이틀 */}
            <div className="flex items-start gap-[1rem] self-stretch border-b border-solid border-b-black-40 p-[1rem]">
              <p className="text-[2rem] font-[600] leading-[1.5] tracking-[-0.04rem] text-black">
                모집글
              </p>
            </div>
            {/** 모집글 카드들 */}
            <div className="relative self-stretch overflow-hidden">
              {canScrollLeft && (
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex">
                  <div className="flex h-[22rem] w-[22rem] items-center bg-team-home-left-slide-background pl-[1.2rem] pr-[16.4rem] backdrop-blur-none">
                    <IconWrapper
                      shape="circle"
                      color="outline"
                      children={<ChevronLeft />}
                      className="pointer-events-auto"
                      onClick={() => {
                        scrollByCard('left');
                      }}
                    />
                  </div>
                </div>
              )}

              {canScrollRight && (
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex">
                  <div className="flex h-[22rem] w-[22rem] items-center bg-team-home-right-slide-background pl-[16.4rem] pr-[1.2rem] backdrop-blur-none">
                    <IconWrapper
                      shape="circle"
                      color="outline"
                      children={<ChevronRight />}
                      className="pointer-events-auto"
                      onClick={() => {
                        scrollByCard('right');
                      }}
                    />
                  </div>
                </div>
              )}

              <div
                ref={trackRef}
                className="flex items-center gap-[1.8rem] overflow-x-auto scroll-smooth scrollbar-hide"
              >
                {posts.map((post) => (
                  <MainCard
                    key={post.id}
                    variant="team"
                    mainCardTitle={post.title}
                    isActvie={activeCard === post.id}
                    onClick={() => {
                      setActiveCard(post.id);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/** 팀원 관리 */}
          <div className="mb-[8rem] flex flex-col items-start gap-[1.6rem] self-stretch">
            {/** 팀원 관리 타이틀 */}
            <div className="flex items-start gap-[1rem] self-stretch border-b border-solid border-b-black-40 p-[1rem]">
              <p className="text-[2rem] font-[600] leading-[1.5] tracking-[-0.04rem] text-black">
                팀원 관리
              </p>
            </div>
            {/** 팀원 명단 카드 */}
            <div className="max-1440:grid-cols-4 inline-grid grid-cols-5 gap-x-[1.8rem] gap-y-[2.4rem] self-stretch [grid-template-rows:repeat(2,fit-content(100%))]">
              {members.map((member) => (
                <SideTeamCard
                  key={member.id}
                  variant="team"
                  title={member.title}
                  job={member.job}
                  isActvie={activeTeamMember === member.id}
                  onClick={() => {
                    setActiveTeamMember(member.id);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamHomePage;
