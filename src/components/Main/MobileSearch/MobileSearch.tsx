import { useState } from 'react';

import type { PostsSort } from '../../../types/api/posts';
import type { Job, Skill, SearchTagItem } from '../../../hooks/useSearchFilters';
import useHorizontalScroll from '../../../hooks/useHorizontalScroll';

import IcFilter from '../../../assets/icons/normal/ic_filter.svg?react';
import ChevronLeft from '../../../assets/icons/normal/chevron/ic_chevronLeft.svg?react';
import ChevronRight from '../../../assets/icons/normal/chevron/ic_chevronRight.svg?react';

import MainSearchTag from '../MainSearch/MainSearchTag';
import MainSearchSelectText from '../MainSearch/MainSearchSelectText';
import MainSearchKeywordField from '../MainSearch/MainSearchKeywordField';
import IconWrapper from '../../common/IconWrapper';
import FilterBottomSheet from './FilterBottomSheet';

export type MobileSearchProps = {
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

const MobileSearch = ({
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
}: MobileSearchProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { trackRef, canScrollLeft, canScrollRight, scrollByItem } =
    useHorizontalScroll({
      itemSelector: '[data-search-tag="true"]',
      gapPx: 8,
      deps: [searchTags.length],
    });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') applyFilters();
  };

  return (
    <div className="flex flex-col items-start gap-[2rem] self-stretch">
      {/* 검색 인풋 + 필터 버튼 */}
      <div className="flex items-center gap-[0.8rem] self-stretch">
        <MainSearchKeywordField
          rounded
          value={keyword}
          onChange={setKeyword}
          onKeyDown={handleKeyDown}
          placeholder="검색어를 입력해주세요"
        />

        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className="flex h-[5rem] w-[5rem] shrink-0 items-center justify-center rounded-[0.8rem] border border-solid border-black-30 bg-white text-black-100 transition-colors"
        >
          <IcFilter className="h-[2rem] w-[2rem]" />
        </button>
      </div>

      {/* 검색 태그 + 정렬 */}
      <div
        className={`flex flex-col items-end self-stretch ${
          searchTags.length > 0 ? 'gap-[1.2em]' : ''
        }`}
      >
        <div className="relative min-w-0 self-stretch overflow-hidden">
          {canScrollLeft && (
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex">
              <div className="flex h-full w-[7.2rem] items-center bg-team-home-left-slide-background pl-[0.8rem]">
                <IconWrapper
                  shape="circle"
                  color="outline"
                  children={<ChevronLeft className="h-[1.4rem] w-[1.4rem]" />}
                  className="pointer-events-auto !h-[2.8rem] !min-h-[2.8rem] !w-[2.8rem] !min-w-[2.8rem] p-0"
                  onClick={() => scrollByItem('left')}
                />
              </div>
            </div>
          )}
          {canScrollRight && (
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex">
              <div className="flex h-full w-[7.2rem] items-center justify-end bg-team-home-right-slide-background pr-[0.8rem]">
                <IconWrapper
                  shape="circle"
                  color="outline"
                  children={<ChevronRight className="h-[1.4rem] w-[1.4rem]" />}
                  className="pointer-events-auto !h-[2.8rem] !min-h-[2.8rem] !w-[2.8rem] !min-w-[2.8rem] p-0"
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

      {/* 필터 바텀시트 */}
      <FilterBottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedJobs={selectedJobs}
        selectedSkills={selectedSkills}
        onToggleJob={onToggleJob}
        onToggleSkill={onToggleSkill}
        onReset={onReset}
        onApply={applyFilters}
      />
    </div>
  );
};

export default MobileSearch;
