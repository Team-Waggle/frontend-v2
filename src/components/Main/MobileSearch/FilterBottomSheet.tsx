import BaseButton from '../../common/Button';
import BaseChip from '../../common/Chip/BaseChip';
import { SKILL_MAP } from '../../../constants/skillMap';
import { SkillIcon } from '../../../utils/SkillIcon';
import { allSkills } from '../MainSearch/skill-data';
import { JOBS } from '../MainSearch/JobSelectList';
import type { Job, Skill } from '../../../hooks/useSearchFilters';
import BottomSheet from '../../common/BottomSheet';
import { useState } from 'react';
import {
  navTabContainerBase,
  navTabContainerActive,
  navTabTextBase,
  navTabTextActive,
  navTabTextInactive,
} from '../../common/Tap/NavTab';

type Tab = 'job' | 'skill';

type FilterBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedJobs: Job[];
  selectedSkills: Skill[];
  onToggleJob: (label: string) => void;
  onToggleSkill: (skill: Skill) => void;
  onReset: () => void;
  onApply: () => void;
};

const FilterBottomSheet = ({
  isOpen,
  onClose,
  selectedJobs,
  selectedSkills,
  onToggleJob,
  onToggleSkill,
  onReset,
  onApply,
}: FilterBottomSheetProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('job');

  const selectedJobLabels = new Set(selectedJobs.map((j) => j.label));
  const selectedSkillIds = new Set(selectedSkills.map((s) => s.id));

  const handleReset = () => {
    onReset();
  };

  const handleApply = () => {
    onApply();
    onClose();
  };

  const tabs: Tab[] = ['job', 'skill'];

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const currentIndex = tabs.indexOf(activeTab);
    const delta = e.key === 'ArrowRight' ? 1 : -1;
    const nextTab = tabs[(currentIndex + delta + tabs.length) % tabs.length];
    setActiveTab(nextTab);
    document.getElementById(`filter-tab-${nextTab}`)?.focus();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} aria-label="검색 필터">
      {/* 탭 */}
      <div
        role="tablist"
        className="flex items-start gap-[2.4rem] self-stretch border-b border-solid border-black-20"
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            id={`filter-tab-${tab}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`filter-tabpanel-${tab}`}
            tabIndex={activeTab === tab ? 0 : -1}
            onClick={() => setActiveTab(tab)}
            onKeyDown={handleTabKeyDown}
            className={`flex ${navTabContainerBase} ${navTabTextBase} ${
              activeTab === tab
                ? `${navTabContainerActive} ${navTabTextActive}`
                : navTabTextInactive
            }`}
          >
            {tab === 'job' ? '직무' : '사용스킬'}
          </button>
        ))}
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'job' && (
          <div
            id="filter-tabpanel-job"
            role="tabpanel"
            aria-labelledby="filter-tab-job"
            className="flex flex-wrap gap-[0.8rem]"
          >
            {JOBS.map((label) => (
              <BaseChip
                key={label}
                isSelected={selectedJobLabels.has(label)}
                onClick={() => onToggleJob(label)}
                aria-pressed={selectedJobLabels.has(label)}
              >
                {label}
              </BaseChip>
            ))}
          </div>
        )}

        {activeTab === 'skill' && (
          <div
            id="filter-tabpanel-skill"
            role="tabpanel"
            aria-labelledby="filter-tab-skill"
            className="flex flex-wrap gap-[0.8rem]"
          >
            {allSkills.map((label) => {
              const id = SKILL_MAP[label as keyof typeof SKILL_MAP];
              const isSelected = selectedSkillIds.has(id);

              return (
                <BaseChip
                  key={id}
                  isSelected={isSelected}
                  mainIcon={<SkillIcon name={label} />}
                  onClick={() => onToggleSkill({ id, label })}
                  aria-pressed={isSelected}
                >
                  {label}
                </BaseChip>
              );
            })}
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="flex gap-[0.8rem]">
        <BaseButton
          color="secondary"
          size="md"
          onClick={handleReset}
          className="flex-1"
        >
          초기화
        </BaseButton>
        <BaseButton
          color="primary"
          size="md"
          onClick={handleApply}
          className="flex-1"
        >
          필터 적용
        </BaseButton>
      </div>
    </BottomSheet>
  );
};

export default FilterBottomSheet;
