// 조회수/좋아요 수 등 카운트 표시 상한 (누적 수치 자체는 그대로 유지)
export const formatCountBadge = (count?: number): string => {
  const value = count ?? 0;

  if (value > 999) {
    return '999+';
  }

  return String(value);
};
