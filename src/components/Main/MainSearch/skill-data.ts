/**
 *
 * MainSearch에서 사용하는 skill data
 * : allSkills는 MainSearch에서 사용하는 skill 목록
 *
 */

export const skillData = {
  기획: ['Figma', 'GA4', 'Jira', 'Notion', 'SQL'],
  디자인: ['After Effects', 'Figma', 'Illustrator', 'Photoshop', 'ProtoPie'],
  프론트엔드: [
    'C#',
    'Javascript',
    'Next.js',
    'React',
    'React Native',
    'TypeScript',
    'UE',
    'Unity',
    'Vue.js',
  ],
  백엔드: [
    'AWS',
    'Django',
    'express.js',
    'FastAPI',
    'Java',
    'Javascript',
    'Kotlin',
    'NestJS',
    'Node.js',
    'Python',
    'Spring',
  ],
  마케팅: ['CRM', 'GA4', 'SEO', 'SNS마케팅', '콘텐츠제작'],
  기타: [
    'After Effects',
    'AWS',
    'C#',
    'CRM',
    'Django',
    'express.js',
    'FastAPI',
    'Figma',
    'GA4',
    'Illustrator',
    'Java',
    'Javascript',
    'Jira',
    'Kotlin',
    'NestJS',
    'Next.js',
    'Node.js',
    'Notion',
    'Photoshop',
    'ProtoPie',
    'Python',
    'React',
    'React Native',
    'SEO',
    'SNS마케팅',
    'Spring',
    'SQL',
    'TypeScript',
    'UE',
    'Unity',
    'Vue.js',
    '콘텐츠제작',
  ],
} as const;

export type PositionType = keyof typeof skillData;

export const allSkills = (() => {
  const set = new Set<string>();
  (Object.keys(skillData) as PositionType[]).forEach((k) => {
    skillData[k].forEach((s) => set.add(s));
  });
  return Array.from(set);
})();
