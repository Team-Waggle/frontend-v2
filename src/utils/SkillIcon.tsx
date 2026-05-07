type SVGComponent = React.FC<React.SVGProps<SVGSVGElement>>;

interface SkillIconProps {
  name: string; // 스킬명
  className?: string;
}

// small 아이콘 svg 로드
const SKILL_ICONS = import.meta.glob<{ default: SVGComponent }>(
  '../assets/icons/skill/small/*.svg',
  {
    query: '?react',
    eager: true,
  },
);

// large 아이콘 svg 로드
const SKILL_ICONS_LARGE = import.meta.glob<{ default: SVGComponent }>(
  '../assets/icons/skill/large/*.svg',
  {
    query: '?react',
    eager: true,
  },
);

// glob 로드 결과 모듈 타입 정의
type SvgModule = { default: SVGComponent };

// 파일명 기준으로 large 아이콘을 찾기 위한 인덱스 맵
const SKILL_ICON_LARGE_BY_FILENAME: Record<string, SVGComponent> =
  Object.fromEntries(
    Object.entries(SKILL_ICONS_LARGE as Record<string, SvgModule>).map(
      ([path, mod]) => {
        const filename = path.split('/').pop() || path;
        return [filename, mod.default];
      },
    ),
  );

const SKILL_NAME_MAP: Record<string, string> = {
  SNS마케팅: 'SNSMarketing',
  콘텐츠제작: 'ContentCreation',
};

// 스킬명 파일명 규칙에 맞게 정규화
const formatSkillName = (str: string) => {
  if (SKILL_NAME_MAP[str]) {
    return SKILL_NAME_MAP[str];
  }
  return str.replace(/\+/g, 'p').replace(/#/g, 'sharp').replace(/\s+/g, '');
};

// small 스킬 아이콘 렌더링
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

// large 스킬 아이콘 렌더링
export const SkillIconLarge = ({ name, className }: SkillIconProps) => {
  const formatted = formatSkillName(name);
  const filename = `ic_skill_${formatted}_large.svg`;

  const IconComponent = SKILL_ICON_LARGE_BY_FILENAME[filename] || null;

  if (!IconComponent) return null;

  return (
    <IconComponent className={`h-[2.8rem] w-[2.8rem] ${className}`.trim()} />
  );
};
