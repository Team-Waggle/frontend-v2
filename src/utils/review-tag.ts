import type { UserReviewTag } from '../types/api/team';

const REVIEW_TAG_DATA: Record<UserReviewTag, string> = {
  PUNCTUAL: '시간엄수',
  SKILLED: '개발왕',
  GOOD_COMMUNICATOR: '소통왕',
  RESPONSIBLE: '책임감',
  KIND: '친절함',
  PICASSO: '피카소',
  PROMOTER: '홍보왕',
  GOAT: '고트',
  LEGEND: '레전드',
  METICULOUS: '꼼꼼함',
  LATE: '지각쟁이',
  NO_SHOW: '잠수왕',
  SENSITIVE: '예민함',
  UNKIND: '불친절',
  DESERTER: '이탈자',
} as const;

export type ReviewTagKey = keyof typeof REVIEW_TAG_DATA;
export type ReviewTagValue = (typeof REVIEW_TAG_DATA)[ReviewTagKey];
export type ReviewTag = ReviewTagKey | ReviewTagValue;

export const REVIEW_TAG_CONVERTER: Record<string, string> = {
  ...REVIEW_TAG_DATA,
  ...Object.fromEntries(
    Object.entries(REVIEW_TAG_DATA).map(([k, v]) => [v, k]),
  ),
};

export const formatReviewTag = (tag: ReviewTag): UserReviewTag => {
  return (REVIEW_TAG_CONVERTER[tag] ?? tag) as UserReviewTag;
};
