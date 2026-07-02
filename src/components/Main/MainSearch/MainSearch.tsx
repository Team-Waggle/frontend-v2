import { useEffect, useRef, useState } from 'react';

import useHorizontalScroll from '../../../hooks/useHorizontalScroll';
import type { PostsSort } from '../../../types/api/posts';
import type { Job, Skill, SearchTagItem } from '../../../hooks/useSearchFilters';

import IcBusinessBag from '../../../../src/assets/icons/normal/ic_businessBag.svg?react';
import IcFolder from '../../../../src/assets/icons/normal/ic_folder.svg?react';
import IcRefresh from '../../../../src/assets/icons/normal/ic_refresh.svg?react';
import ChevronLeft from '../../../assets/icons/normal/chevron/ic_chevronLeft.svg?react';
import ChevronRight from '../../../assets/icons/normal/chevron/ic_chevronRight.svg?react';

import MainSearchTag from './MainSearchTag';
import MainSearchSelectText from './MainSearchSelectText';
import MainSearchSelectField from './MainSearchSelectField';
import MainSearchKeywordField from './MainSearchKeywordField';
import SearchKeywordOverlay from './SearchKeywordOverlay';
import SearchSkillSelectBox from './SearchSkillSelectBox';
import SearchJobSelectBox from './SearchJobSelectBox';
import IconWrapper from '../../common/IconWrapper';

type OpenMenu = 'job' | 'skill' | 'keyword' | null;

export type MainSearchProps = {
  sort: PostsSort;
  onChangeSort: (sort: PostsSort) => void;
  keyword: string;
  setKeyword: (v: string) => void;
  selectedJobs: Job[];
  selectedSkills: Skill[];
  searchTags: SearchTagItem[];
  onToggleJob: (label: string) => void;
  onToggleSkill: (skill: Skill) => void;
  removeSearchTag: (tag: SearchTagItem) => void;
  applyFilters: () => void;
  onReset: () => void;
};

const MainSearch = ({
  sort,
  onChangeSort,
  keyword,
  setKeyword,
  selectedJobs,
  selectedSkills,
  searchTags,
  onToggleJob,
  onToggleSkill,
  removeSearchTag,
  applyFilters,
  onReset,
}: MainSearchProps) => {
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const target = e.target as Node | null;
      if (!target) return;
      if (!el.contains(target)) setOpenMenu(null);
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  const buildCountEllipsisLabel = (
    prefix: string,
    items: string[],
    maxChars: number,
    placeholder: string,
  ) => {
    if (items.length === 0) return placeholder;
    const full = `${prefix}(${items.length}) ${items.join(', ')}`;
    if (full.length <= maxChars) return full;
    return `${full.slice(0, Math.max(0, maxChars - 3))}...`;
  };

  const toggleMenu = (menu: Exclude<OpenMenu, null>) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const handleApplyFilters = () => {
    applyFilters();
    setOpenMenu(null);
  };

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    onReset();
    setOpenMenu(null);
    const icon = e.currentTarget.querySelector('svg');
    if (!icon) return;
    icon.classList.remove('spin-once');
    void icon.getBoundingClientRect();
    icon.classList.add('spin-once');
  };

  const jobLabel = buildCountEllipsisLabel(
    '사용직무',
    selectedJobs.map((j) => j.label),
    34,
    '직무를 선택해주세요.',
  );

  const skillLabel = buildCountEllipsisLabel(
    '사용스킬',
    selectedSkills.map((s) => s.label),
    34,
    '사용스킬을 선택해주세요.',
  );

  const { trackRef, canScrollLeft, canScrollRight, scrollByItem } =
    useHorizontalScroll({
      itemSelector: '[data-search-tag="true"]',
      gapPx: 8,
      deps: [searchTags.length],
    });

  return (
    <div className="flex w-full max-w-[152.6rem] flex-col items-start gap-[2rem]">
      <div className="flex h-[5rem] items-center gap-[2.4rem] self-stretch max-1440:w-full">
        <div className="flex min-w-0 flex-1 items-center self-stretch">
          <div ref={containerRef} className="relative min-w-0 flex-1">
            <div className="flex h-[5rem] w-full items-center rounded-[0.8rem] rounded-r-none border border-x-0 border-solid border-[#B7B9C0] bg-white">
              <MainSearchSelectField
                variant="job"
                isSelected={selectedJobs.length > 0}
                icon={<IcBusinessBag />}
                valueLabel={jobLabel}
                isOpen={openMenu === 'job'}
                onToggle={() => toggleMenu('job')}
                suppressRightBorder={openMenu === 'skill'}
                highlightRightBorder={selectedSkills.length > 0}
              />
              <MainSearchSelectField
                variant="skill"
                isSelected={selectedSkills.length > 0}
                icon={<IcFolder />}
                valueLabel={skillLabel}
                isOpen={openMenu === 'skill'}
                onToggle={() => toggleMenu('skill')}
                hasKeyword={keyword.trim().length > 0}
              />
              <MainSearchKeywordField
                onChange={setKeyword}
                onFocus={() => setOpenMenu('keyword')}
                value={keyword}
              />
            </div>

            {openMenu === 'keyword' && (
              <SearchKeywordOverlay
                value={keyword}
                onChange={setKeyword}
                onSearch={handleApplyFilters}
              />
            )}
            {openMenu === 'job' && (
              <SearchJobSelectBox
                values={selectedJobs.map((j) => j.label)}
                onToggle={onToggleJob}
              />
            )}
            {openMenu === 'skill' && (
              <SearchSkillSelectBox
                selectedSkills={selectedSkills}
                onToggleSkill={onToggleSkill}
              />
            )}
          </div>

          <button
            type="button"
            onClick={handleApplyFilters}
            className="flex w-[16rem] items-center justify-center gap-[1rem] self-stretch rounded-r-[0.8rem] bg-blue-80 px-[2rem] hover:bg-hover-80"
          >
            <span className="text-[1.6rem] font-[700] text-white">확인</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex w-[5rem] items-center justify-center gap-[1rem] self-stretch rounded-[0.6rem] border border-solid border-[#CFD1D5]"
        >
          <IcRefresh className="text-black-60 transition-none" />
        </button>
      </div>

      <div className="flex items-center justify-between self-stretch">
        <div className="relative min-w-0 flex-1 self-stretch overflow-hidden">
          {canScrollLeft && (
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex">
              <div className="flex h-full w-[9.2rem] items-center bg-team-home-left-slide-background pl-[1.2rem] pr-[1.2rem] backdrop-blur-none">
                <IconWrapper
                  shape="circle"
                  color="outline"
                  children={<ChevronLeft className="h-[1.7455rem] w-[1.7455rem]" />}
                  className="pointer-events-auto !h-[3.2rem] !min-h-[3.2rem] !w-[3.2rem] !min-w-[3.2rem] p-0"
                  onClick={() => scrollByItem('left')}
                />
              </div>
            </div>
          )}
          {canScrollRight && (
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex">
              <div className="flex h-full w-[9.2rem] items-center justify-end bg-team-home-right-slide-background pl-[1.2rem] pr-[1.2rem] backdrop-blur-none">
                <IconWrapper
                  shape="circle"
                  color="outline"
                  children={<ChevronRight className="h-[1.7455rem] w-[1.7455rem]" />}
                  className="pointer-events-auto !h-[3.2rem] !min-h-[3.2rem] !w-[3.2rem] !min-w-[3.2rem] p-0"
                  onClick={() => scrollByItem('right')}
                />
              </div>
            </div>
          )}
          <div
            ref={trackRef}
            className="flex h-full min-w-0 items-center gap-[0.8rem] overflow-x-auto scroll-smooth scrollbar-hide"
          >
            {searchTags.map((t) => (
              <div key={`${t.type}-${t.id}`} data-search-tag="true">
                <MainSearchTag TagTitle={t.title} onRemove={() => removeSearchTag(t)} />
              </div>
            ))}
          </div>
        </div>

        <MainSearchSelectText sort={sort} onChangeSort={onChangeSort} />
      </div>
    </div>
  );
};

export default MainSearch;
