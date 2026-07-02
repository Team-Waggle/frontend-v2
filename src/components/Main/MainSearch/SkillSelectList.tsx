import BaseChip from '../../common/Chip/BaseChip';
import { SKILL_MAP } from '../../../constants/skillMap';
import { SkillIcon } from '../../../utils/SkillIcon';
import { allSkills } from './skill-data';

type Skill = { id: string; label: string };

type SkillSelectListProps = {
  selectedSkills: Skill[];
  onToggleSkill: (skill: Skill) => void;
};

const SkillSelectList = ({ selectedSkills, onToggleSkill }: SkillSelectListProps) => {
  const selectedSet = new Set(selectedSkills.map((s) => s.id));

  return (
    <div className="flex flex-wrap content-start items-start gap-[0.8rem] self-stretch rounded-[0.8rem] border border-solid border-[#237BFF] bg-white p-[1.8rem] shadow-search-select-box">
      {allSkills.map((label) => {
        const id = SKILL_MAP[label as keyof typeof SKILL_MAP];
        const isSelected = selectedSet.has(id);

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
  );
};

export default SkillSelectList;
