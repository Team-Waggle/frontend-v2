import type { UserReviewTag } from '../types/api/user';

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
  LATE: '지각',
  NO_SHOW: '노쇼',
  SENSITIVE: '예민함',
  UNKIND: '불친절',
  DESERTER: '잠수',
};

export const formatReviewTag = (tag: UserReviewTag): string => {
  return REVIEW_TAG_DATA[tag] ?? tag;
};
