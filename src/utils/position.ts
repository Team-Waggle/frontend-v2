// 클라이언트와 서버간의 포지션 변경해주는 함수
// POSITION_CONVERTER['FRONTEND'] -> '프론트엔드'
// POSITION_CONVERTER['프론트엔드'] -> 'FRONTEND'

const POSITION_DATA = {
  기획: 'PLANNER',
  디자인: 'DESIGNER',
  프론트엔드: 'FRONTEND',
  백엔드: 'BACKEND',
  마케팅: 'MARKETER',
  기타: 'OTHER',
} as const;

export type PositionKey = keyof typeof POSITION_DATA;
export type PositionValue = (typeof POSITION_DATA)[PositionKey];

export const POSITION_CONVERTER: Record<string, string> = {
  ...POSITION_DATA,
  ...Object.fromEntries(Object.entries(POSITION_DATA).map(([k, v]) => [v, k])),
};
