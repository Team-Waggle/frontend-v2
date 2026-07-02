import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import NavTab from '../common/Tap/NavTab';

const TeamNav = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);
  const hasDragged = useRef(false);

  const tabs = [
    { label: '메인 홈', to: `/team/${teamId}` },
    { label: '모집글 관리', to: `/team/${teamId}/posts` },
    { label: '지원자 관리', to: `/team/${teamId}/applicants` },
    { label: '팀 상태 관리', to: `/team/${teamId}/status` },
  ];

  const updateGradients = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    hasDragged.current = false;
    dragStartX.current = e.pageX;
    dragStartScrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const delta = e.pageX - dragStartX.current;
    if (Math.abs(delta) > 4) hasDragged.current = true;
    scrollRef.current.scrollLeft = dragStartScrollLeft.current - delta;
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasDragged.current) e.stopPropagation();
  };

  useEffect(() => {
    updateGradients();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateGradients);
    window.addEventListener('resize', updateGradients);
    return () => {
      el.removeEventListener('scroll', updateGradients);
      window.removeEventListener('resize', updateGradients);
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const activeLink = el.querySelector<HTMLElement>(
      `a[href="${location.pathname}"]`,
    );
    if (!activeLink) return;
    const center =
      activeLink.offsetLeft - el.clientWidth / 2 + activeLink.offsetWidth / 2;
    el.scrollTo({ left: center, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="relative w-full max-w-[clamp(98.2rem,70vw,130rem)] max-sm:px-[2rem]">
      <div
        ref={scrollRef}
        className={`flex w-full items-center gap-[2.4rem] overflow-x-auto border-b border-solid border-black-20 scrollbar-hide ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClickCapture={handleClickCapture}
      >
        {tabs.map((tab) => (
          <NavTab
            key={tab.to}
            to={tab.to}
            isActive={location.pathname === tab.to}
            className="shrink-0"
          >
            {tab.label}
          </NavTab>
        ))}
      </div>
      {showLeft && (
        <div
          className="pointer-events-none absolute left-0 top-0 z-10 hidden h-[5.4rem] w-[10.6rem] max-xs:block"
          style={{
            background:
              'linear-gradient(90deg, #FFF 10%, rgba(255, 255, 255, 0.00) 100%)',
          }}
        />
      )}
      {showRight && (
        <div
          className="pointer-events-none absolute right-0 top-0 z-10 hidden h-[5.4rem] w-[10.6rem] max-xs:block"
          style={{
            background:
              'linear-gradient(270deg, #FFF 10%, rgba(255, 255, 255, 0.00) 100%)',
          }}
        />
      )}
    </div>
  );
};

export default TeamNav;
