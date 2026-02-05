import { allSkills } from './skill-data';

/**
 * MainSearch: 스킬 필드 (Skill Field) 클릭 시 뜨는 Select 박스
 */

type Skill = { id: string; label: string };

type SearchSkillSelectBoxProps = {
  selectedSkills: Skill[];
  onToggleSkill: (skill: Skill) => void;
};

const formatSkillIconName = (skill: string) => {
  return skill.replace(/\+/g, 'p').replace(/#/g, 'sharp').replace(/\s+/g, '');
};

const SearchSkillSelectBox = ({
  selectedSkills,
  onToggleSkill,
}: SearchSkillSelectBoxProps) => {
  const selectedSet = new Set(selectedSkills.map((s) => s.id));

  return (
    <div className="absolute left-0 top-[calc(5rem+0.8rem)] z-[20]">
      <div className="flex flex-wrap content-start items-start gap-[0.8rem] self-stretch rounded-[0.8rem] border border-solid border-[#237BFF] bg-white p-[1.8rem] shadow-search-select-box">
        {allSkills.map((label) => {
          const id = label;
          const isSelected = selectedSet.has(id);
          const iconKey = formatSkillIconName(label);

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
              <img
                src={`/assets/icons/skill/small/ic_skill_${iconKey}_small.svg`}
                alt=""
                className="h-[1.6rem] w-[1.6rem]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="text-[1.4rem] font-[500]">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchSkillSelectBox;
