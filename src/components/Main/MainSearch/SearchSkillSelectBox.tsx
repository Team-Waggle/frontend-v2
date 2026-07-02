import SkillSelectList from './SkillSelectList';

type Skill = { id: string; label: string };

type SearchSkillSelectBoxProps = {
  selectedSkills: Skill[];
  onToggleSkill: (skill: Skill) => void;
};

const SearchSkillSelectBox = ({ selectedSkills, onToggleSkill }: SearchSkillSelectBoxProps) => {
  return (
    <div className="absolute left-0 top-[calc(5rem+0.8rem)] z-[20]">
      <SkillSelectList selectedSkills={selectedSkills} onToggleSkill={onToggleSkill} />
    </div>
  );
};

export default SearchSkillSelectBox;
