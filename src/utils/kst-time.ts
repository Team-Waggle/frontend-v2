type KstParts = {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
};


const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

const pad2 = (value: number): string => {
  // 두 자리 고정이 필요한 월 일 시 분에 사용
  return String(value).padStart(2, '0');
};

const normalizeUtcIso = (utcIso: string): string => {
  const trimmed = (utcIso || '').trim();

  // YYYY-MM-DDTHH:MM:SS.123456Z 같은 경우 소수점 3자리로 잘라서 파싱 안정화
  return trimmed.replace(/\.(\d{3})\d+([zZ]|[+-]\d{2}:\d{2})$/, '.$1$2');
};

const parseUtcIsoToMs = (utcIso: string): number => {
  // UTC ISO 문자열을 Date로 파싱, 밀리초 타임스탬프로 변환
  // 예: YYYY-MM-DDTHH:MM:SS.123456Z
  const normalized = normalizeUtcIso(utcIso);

  const date = new Date(normalized);
  const ms = date.getTime();

  // 파싱 실패 시 예외 처리
  if (Number.isNaN(ms)) {
    throw new Error(`Invalid UTC ISO string: ${utcIso}`);
  }

  return ms;
};

const utcMsToKstParts = (utcMs: number): KstParts => {
  const kstDate = new Date(utcMs + KST_OFFSET_MS);

  const year = kstDate.getUTCFullYear();
  const month = kstDate.getUTCMonth() + 1;
  const day = kstDate.getUTCDate();
  const hours = kstDate.getUTCHours();
  const minutes = kstDate.getUTCMinutes();

  return { year, month, day, hours, minutes };
};

// UTC -> KST 기준 YY.MM.DD 로 변환
export const formatKstYyMmDd = (utcIso: string): string => {
  const utcMs = parseUtcIsoToMs(utcIso);
  const { year, month, day } = utcMsToKstParts(utcMs);

  const yy = pad2(year % 100);
  const mm = pad2(month);
  const dd = pad2(day);

  return `${yy}.${mm}.${dd}`;
};

// UTC -> KST 기준 YY.MM.DD HH:MM 로 변환
export const formatKstYyMmDdHm = (utcIso: string): string => {
  const utcMs = parseUtcIsoToMs(utcIso);
  const { year, month, day, hours, minutes } = utcMsToKstParts(utcMs);

  const yy = pad2(year % 100);
  const mm = pad2(month);
  const dd = pad2(day);
  const hh = pad2(hours);
  const min = pad2(minutes);

  return `${yy}.${mm}.${dd} ${hh}:${min}`;
};

/**
 *
 * 모집글 목록 createdAt 표시 규칙
 *
 * 3분 미만: 방금 전
 * 3~59분: N분 전
 * 60분~23시간 59분: N시간 전
 * 24시간~6일 23시간 59분: N일 전
 * 이외: YY.MM.DD
 */

export const formatPostListCreatedAt = (createdAtUtcIso: string): string => {
  const createdAtMs = parseUtcIsoToMs(createdAtUtcIso);
  const diffMs = Date.now() - createdAtMs;

  if (diffMs < 0) {
    return formatKstYyMmDd(createdAtUtcIso);
  }

  const diffMinutes = Math.floor(diffMs / (60 * 1000));
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  if (diffMinutes < 3) {
    return '방금 전';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }

  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  if (diffDays < 7) {
    return `${diffDays}일 전`;
  }

  return formatKstYyMmDd(createdAtUtcIso);
};

/**
 *
 * 모집글 상세보기 createdAt 표시
 * YY.MM.DD HH:MM
 *
 */

export const formatPostDetailCreatedAt = (createdAtUtcIso: string): string => {
  return formatKstYyMmDdHm(createdAtUtcIso);
};

/**
 *
 * 팀 카드 createdAt 표시
 * YY.MM.DD
 *
 */

export const formatTeamCardCreatedAt = (createdAtUtcIso: string): string => {
  return formatKstYyMmDd(createdAtUtcIso);
};

// UTC -> KST 기준 대화 목록 시간 표시 (방금 전 / N분 전 / N시간 전 / N일 전 / M/D)
export const formatConversationTime = (utcIso: string): string => {
  const createdAtMs = parseUtcIsoToMs(utcIso);
  const nowMs = Date.now();
  const diffMs = nowMs - createdAtMs;
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffH = Math.floor(diffMin / 60);
  const diffD = Math.floor(diffH / 24);

  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffH < 24) return `${diffH}시간 전`;
  if (diffD < 7) return `${diffD}일 전`;

  const { month, day } = utcMsToKstParts(createdAtMs);
  return `${month}/${day}`;
};

// UTC -> KST 기준 HH:MM 로 변환
export const formatKstHhMm = (utcIso: string): string => {
  const utcMs = parseUtcIsoToMs(utcIso);
  const { hours, minutes } = utcMsToKstParts(utcMs);
  return `${pad2(hours)}:${pad2(minutes)}`;
};

// UTC -> KST 기준 YYYY.MM.DD 로 변환
export const formatKstYyyyMmDd = (utcIso: string): string => {
  const utcMs = parseUtcIsoToMs(utcIso);
  const { year, month, day } = utcMsToKstParts(utcMs);
  return `${year}.${pad2(month)}.${pad2(day)}`;
};
