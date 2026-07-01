import BaseButton from '../../common/Button';
import BaseChip from '../../common/Chip/BaseChip';
import { SKILL_MAP } from '../../../constants/skillMap';
import { SkillIcon } from '../../../utils/SkillIcon';
import { allSkills } from '../MainSearch/skill-data';
import { JOBS } from '../MainSearch/JobSelectList';
import type { Job, Skill } from '../../../hooks/useSearchFilters';
import BottomSheet from './BottomSheet';
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

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      {/* 탭 */}
      <div className="flex items-start gap-[2.4rem] self-stretch border-b border-solid border-black-20">
        {(['job', 'skill'] as Tab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex ${navTabContainerBase} ${navTabTextBase} ${
              activeTab === tab ? `${navTabContainerActive} ${navTabTextActive}` : navTabTextInactive
            }`}
          >
            {tab === 'job' ? '직무' : '사용스킬'}
          </button>
        ))}
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'job' && (
          <div className="flex flex-wrap gap-[0.8rem]">
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
          <div className="flex flex-wrap gap-[0.8rem]">
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
