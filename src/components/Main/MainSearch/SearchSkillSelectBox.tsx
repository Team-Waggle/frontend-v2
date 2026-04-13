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
    <div className="absolute left-0 right-0 top-[calc(4.4rem+0.4rem)] z-[20] sm:right-auto sm:top-[calc(5rem+0.8rem)]">
      <div className="flex flex-wrap content-start items-start gap-[0.8rem] self-stretch rounded-[0.8rem] border border-solid border-[#237BFF] bg-white p-[1.8rem] shadow-search-select-box">
        {allSkills.map((label) => {
          const id = SKILL_MAP[label as keyof typeof SKILL_MAP];
          const isSelected = selectedSet.has(id);

          const baseStyle =
            'flex h-[4rem] items-center justify-center gap-[0.5rem] rounded-[9.9rem] border border-solid px-[1.2rem] hover:border-[#06F] hover:bg-[#F0F6FF] hover:text-[#0E0E0F]';
          const selectedStyle = 'border-[#06F] bg-[#F0F6FF] text-[#0E0E0F]';
          const unSelectedStyle = 'border-[#CFD1D5] bg-white text-[#51535A]';

          return (
            <button
              key={id}
              type="button"
              onClick={() => onToggleSkill({ id, label })}
              className={`${baseStyle} ${isSelected ? selectedStyle : unSelectedStyle}`}
              aria-pressed={isSelected}
            >
              <SkillIcon name={label} className="h-[1.6rem] w-[1.6rem]" />
              <span className="text-[1.4rem] font-[500]">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchSkillSelectBox;
