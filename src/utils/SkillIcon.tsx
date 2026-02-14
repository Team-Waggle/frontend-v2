type SVGComponent = React.FC<React.SVGProps<SVGSVGElement>>;

interface SkillIconProps {
  name: string; // 스킬명
  className?: string;
}

const SKILL_ICONS = import.meta.glob<{ default: SVGComponent }>(
  '../assets/icons/skill/small/*.svg',
  {
    query: '?react',
    eager: true,
  },
);

const formatSkillName = (str: string) =>
  str.replace(/\+/g, 'p').replace(/#/g, 'sharp').replace(/\s+/g, '');

export const SkillIcon = ({ name, className }: SkillIconProps) => {
  const formatted = formatSkillName(name);
  const targetPattern = `ic_skill_${formatted}_small.svg`;

  const iconKey = Object.keys(SKILL_ICONS).find((key) =>
    key.includes(targetPattern),
  );
  const IconComponent = iconKey ? SKILL_ICONS[iconKey].default : null;

  if (!IconComponent) return null;

  return <IconComponent className={className} />;
};
