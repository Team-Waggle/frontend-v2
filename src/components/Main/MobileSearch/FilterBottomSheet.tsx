import { useEffect, useState } from 'react';
import BaseButton from '../../common/Button';
import BaseChip from '../../common/Chip/BaseChip';
import { SKILL_MAP } from '../../../constants/skillMap';
import { SkillIcon } from '../../../utils/SkillIcon';
import { allSkills } from '../MainSearch/skill-data';
import { JOBS } from '../MainSearch/JobSelectList';
import type { Job, Skill } from '../../../hooks/useSearchFilters';
import BottomSheet from '../../common/BottomSheet';
import {
  navTabContainerActive,
  navTabContainerBase,
  navTabTextActive,
  navTabTextBase,
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
  jobTabLabel?: string;
  jobOptions?: string[];
  skillOptions?: Skill[];
  initialTab?: Tab;
  isSkillDisabled?: boolean;
  ariaLabel?: string;
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
  jobTabLabel = '직무',
  jobOptions = JOBS,
  skillOptions = allSkills.map((label) => ({
    id: SKILL_MAP[label as keyof typeof SKILL_MAP],
    label,
  })),
  initialTab = 'job',
  isSkillDisabled = false,
  ariaLabel = '검색 필터',
}: FilterBottomSheetProps) => {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  const selectedJobLabels = new Set(selectedJobs.map((j) => j.label));
  const selectedSkillIds = new Set(selectedSkills.map((s) => s.id));

  useEffect(() => {
    if (isOpen) setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  useEffect(() => {
    if (isSkillDisabled && activeTab === 'skill') setActiveTab('job');
  }, [activeTab, isSkillDisabled]);

  const handleReset = () => {
    onReset();
  };

  const handleApply = () => {
    onApply();
    onClose();
  };

  const tabs: Tab[] = ['job', 'skill'];

  const handleTabChange = (tab: Tab) => {
    if (tab === 'skill' && isSkillDisabled) return;
    setActiveTab(tab);
  };

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();

    const enabledTabs = tabs.filter(
      (tab) => !(tab === 'skill' && isSkillDisabled),
    );
    const currentIndex = enabledTabs.indexOf(activeTab);
    const delta = e.key === 'ArrowRight' ? 1 : -1;
    const nextTab =
      enabledTabs[
        (currentIndex + delta + enabledTabs.length) % enabledTabs.length
      ];

    setActiveTab(nextTab);
    document.getElementById(`filter-tab-${nextTab}`)?.focus();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} aria-label={ariaLabel}>
      <div
        role="tablist"
        className="flex items-start gap-[2.4rem] self-stretch border-b border-solid border-black-20"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          const isDisabled = tab === 'skill' && isSkillDisabled;

          return (
            <button
              key={tab}
              id={`filter-tab-${tab}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`filter-tabpanel-${tab}`}
              aria-disabled={isDisabled}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleTabChange(tab)}
              onKeyDown={handleTabKeyDown}
              className={`flex ${navTabContainerBase} ${navTabTextBase} ${
                isActive
                  ? `${navTabContainerActive} ${navTabTextActive}`
                  : navTabTextInactive
              } ${isDisabled ? 'cursor-not-allowed opacity-40' : ''}`}
            >
              {tab === 'job' ? jobTabLabel : '사용스킬'}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'job' && (
          <div
            id="filter-tabpanel-job"
            role="tabpanel"
            aria-labelledby="filter-tab-job"
            className="flex flex-wrap gap-[0.8rem]"
          >
            {jobOptions.map((label) => (
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
            className="flex max-h-[29.6rem] flex-wrap gap-[0.8rem]"
          >
            {skillOptions.map((skill) => {
              const isSelected = selectedSkillIds.has(skill.id);

              return (
                <BaseChip
                  key={skill.id}
                  isSelected={isSelected}
                  mainIcon={<SkillIcon name={skill.label} />}
                  onClick={() => onToggleSkill(skill)}
                  aria-pressed={isSelected}
                >
                  {skill.label}
                </BaseChip>
              );
            })}
          </div>
        )}
      </div>

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
