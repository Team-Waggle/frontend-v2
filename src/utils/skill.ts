import { SKILL_MAP } from '../constants/skillMap';

type StringMap = Record<string, string>;


// label -> enumValue 형태의 맵을 enumValue -> label 형태로 뒤집는 변환
const buildReverseMap = (map: StringMap): StringMap => {
    const reverse: StringMap = {};

    Object.keys(map).forEach((label) => {
        const enumValue = map[label];
        reverse[enumValue] = label;
    });

    return reverse;
};

// SKILL_MAP을 변환 함수들이 쓰기 쉬운 형태로 정규화
const skillMap = SKILL_MAP as unknown as StringMap;

// enumValue -> label 변환을 위한 역방향 맵
const SKILL_LABEL_BY_ENUM = buildReverseMap(skillMap);

// 사용자가 선택한 라벨 값을 서버 전송용 enum 값으로 변환
export const toSkillEnum = (label: string): string | undefined => {
    const trimmed = (label || '').trim();
    if (!trimmed) return undefined;

    return skillMap[trimmed];
};

// 서버에서 내려온 enum 값을 화면 표시용 라벨로 변환
export const toSkillLabel = (value: string): string => {
    const trimmed = (value || '').trim();
    if (!trimmed) return '';

    return SKILL_LABEL_BY_ENUM[trimmed] || trimmed;
};