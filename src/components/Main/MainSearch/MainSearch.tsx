import { useEffect, useMemo, useRef, useState } from 'react';

import IcBusinessBag from '../../../../src/assets/icons/normal/ic_businessBag.svg?react';
import IcFolder from '../../../../src/assets/icons/normal/ic_folder.svg?react';
import IcRefresh from '../../../../src/assets/icons/normal/ic_refresh.svg?react';

import MainSearchTag from './MainSearchTag';
import MainSearchSelectText from './MainSearchSelectText';

import MainSearchSelectField from './MainSearchSelectField';
import MainSearchKeywordField from './MainSearchKeywordField';
import SearchKeywordOverlay from './SearchKeywordOverlay';

import SearchSkillSelectBox from './SearchSkillSelectBox';
import SearchJobSelectBox from './SearchJobSelectBox';

/**
 *
 * MainSearch
 * : 홈 화면의 Search 컴포넌트
 *
 * 수정해야할 사항
 * 1. 직무를 선택하고, 스킬을 선택했을 때 중간의 회색 공백이 있음. 그 부분을 아직 해결하지 X.
 * 2. 스킬을 선택하고, 직무를 선택했을 때 중간의 회색 공백. 위와 똑같은 문제점.
 * 3. w 1440px일 때의 반응형 화면
 *
 */

type OpenMenu = 'job' | 'skill' | 'keyword' | null;

type Job = { id: string; label: string };
type Skill = { id: string; label: string };

type TagType = 'job' | 'skill';

type SearchTagItem = {
  type: TagType;
  id: string;
  title: string;
};

const MainSearch = () => {
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);

  const [selectedJobs, setSelectedJobs] = useState<Job[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [keyword, setKeyword] = useState('');

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const el = containerRef.current;
      if (!el) return;

      const target = e.target as Node | null;
      if (!target) return;

      if (!el.contains(target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  const buildCountEllipsisLabel = (
    prefix: string,
    items: string[],
    maxChars: number,
    placeholder: string,
  ) => {
    if (items.length === 0) return placeholder;

    const head = `${prefix}(${items.length}) `;
    const body = items.join(', ');
    const full = `${head}${body}`;

    if (full.length <= maxChars) return full;

    const cut = Math.max(0, maxChars - 3);
    return `${full.slice(0, cut)}...`;
  };

  const jobItems = selectedJobs.map((j) => j.label);
  const skillItems = selectedSkills.map((s) => s.label);

  const jobLabel = buildCountEllipsisLabel(
    '사용직무',
    jobItems,
    34,
    '직무를 선택해주세요.',
  );

  const skillLabel = buildCountEllipsisLabel(
    '사용스킬',
    skillItems,
    34,
    '사용스킬을 선택해주세요.',
  );

  const toggleMenu = (menu: Exclude<OpenMenu, null>) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const onToggleJob = (label: string) => {
    setSelectedJobs((prev) => {
      const exists = prev.some((j) => j.id === label);
      if (exists) return prev.filter((j) => j.id !== label);
      return [...prev, { id: label, label }];
    });
  };

  const onToggleSkill = (skill: Skill) => {
    setSelectedSkills((prev) => {
      const exists = prev.some((s) => s.id === skill.id);
      if (exists) return prev.filter((s) => s.id !== skill.id);
      return [...prev, skill];
    });
  };

  const onReset = () => {
    setSelectedJobs([]);
    setSelectedSkills([]);
    setKeyword('');
    setOpenMenu(null);
  };

  const onSearch = () => {
    console.log({
      jobs: selectedJobs,
      skills: selectedSkills,
      keyword,
    });
  };

  const hasKeyword = keyword.trim().length > 0;

  const searchTags = useMemo<SearchTagItem[]>(() => {
    const jobTags = selectedJobs.map((j) => ({
      type: 'job' as const,
      id: j.id,
      title: j.label,
    }));

    const skillTags = selectedSkills.map((s) => ({
      type: 'skill' as const,
      id: s.id,
      title: s.label,
    }));

    return [...jobTags, ...skillTags];
  }, [selectedJobs, selectedSkills]);

  const removeSearchTag = (tag: SearchTagItem) => {
    if (tag.type === 'job') {
      setSelectedJobs((prev) => prev.filter((j) => j.id !== tag.id));
      return;
    }

    setSelectedSkills((prev) => prev.filter((s) => s.id !== tag.id));
  };

  return (
    <div className="max-[152.6rem] flex w-[152.6rem] flex-col items-start gap-[2rem] pt-[5.4rem]">
      <div className="flex h-[5rem] items-center gap-[2.4rem] self-stretch">
        <div className="flex items-center self-stretch">
          <div ref={containerRef} className="relative">
            <div className="flex h-[5rem] w-[129.2rem] items-center rounded-[0.8rem] rounded-r-none border border-x-0 border-solid border-[#B7B9C0] bg-white">
              <MainSearchSelectField
                variant="job"
                isSelected={selectedJobs.length > 0}
                icon={<IcBusinessBag />}
                valueLabel={jobLabel}
                isOpen={openMenu === 'job'}
                onToggle={() => toggleMenu('job')}
                suppressRightBorder={openMenu === 'skill'}
                hasKeyword={hasKeyword}
              />

              <MainSearchSelectField
                variant="skill"
                isSelected={selectedSkills.length > 0}
                icon={<IcFolder />}
                valueLabel={skillLabel}
                isOpen={openMenu === 'skill'}
                onToggle={() => toggleMenu('skill')}
                hasKeyword={hasKeyword}
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
                onSearch={onSearch}
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

          <button type="button" className="flex w-[16rem] items-center justify-center gap-[1rem] self-stretch rounded-r-[0.8rem] bg-[#06F] px-[2rem]">
            <span className="text-[1.6rem] font-[700] text-white">확인</span>
          </button>
        </div>

        <button
          onClick={(e) => {
            onReset();

            const icon = e.currentTarget.querySelector('svg');
            if (!icon) return;

            icon.classList.remove('spin-once');
            void icon.getBoundingClientRect();
            icon.classList.add('spin-once');
          }}
          className="flex w-[5rem] items-center justify-center gap-[1rem] self-stretch rounded-[0.6rem] border border-solid border-[#CFD1D5]"
        >
          <IcRefresh className="text-[#878B96] transition-none" />
        </button>
      </div>

      <div className="flex items-center justify-between self-stretch">
        <div className="flex items-center gap-[0.8rem]">
          {searchTags.map((t) => (
            <MainSearchTag
              key={`${t.type}-${t.id}`}
              TagTitle={t.title}
              onRemove={() => removeSearchTag(t)}
            />
          ))}
        </div>

        <MainSearchSelectText />
      </div>
    </div>
  );
};

export default MainSearch;
