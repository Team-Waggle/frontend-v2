import BaseChip from '../../common/Chip/BaseChip';

import { SKILL_MAP } from '../../../constants/skillMap';
import { SkillIcon } from '../../../utils/SkillIcon';
import { allSkills } from './skill-data';

/**
 * MainSearch: 스킬 필드 (Skill Field) 클릭 시 뜨는 Select 박스
 */

type Skill = { id: string; label: string };

type SearchSkillSelectBoxProps = {
  selectedSkills: Skill[];
  onToggleSkill: (skill: Skill) => void;
};

const SearchSkillSelectBox = ({
  selectedSkills,
  onToggleSkill,
}: SearchSkillSelectBoxProps) => {
  const selectedSet = new Set(selectedSkills.map((s) => s.id));

  return (
    <div className="absolute left-0 top-[calc(5rem+0.8rem)] z-[20] w-full wide:w-auto wide:min-w-[60rem]">
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
    </div>
  );
};

export default SearchSkillSelectBox;
