interface TeamPostStatusToggleProps {
  isClosed: boolean;
  onClick: () => void;
}

/**
 * 레이아웃 계산 (단위: rem)
 *
 * DOM 순서: [원(2.8)] [gap(0.6)] [텍스트(3.6)] — 항상 고정
 * 컨테이너 내부 콘텐츠 너비: 2.8 + 0.6 + 3.6 = 7rem
 *
 * ── 마감 상태 (isClosed=true) ──────────────────────────────
 *   padding: 0.6rem 1.2rem 0.6rem 0.4rem
 *   자연 배치 → [원 | 텍스트] (DOM 순서와 일치, translate 없음)
 *   원 위치: left 0.4rem, 텍스트 위치: 0.4 + 2.8 + 0.6 = 3.8rem
 *
 * ── 모집 상태 (isClosed=false) ────────────────────────────
 *   padding: 0.6rem 0.4rem 0.6rem 1.2rem
 *   원하는 배치 → [텍스트 | 원]
 *   자연 배치 기준 원: 1.2rem, 텍스트: 4.6rem
 *   원을 오른쪽으로 이동: 목표(5.4rem) - 자연(1.2rem) = +4.2rem → translate-x-[4.2rem]
 *   텍스트를 왼쪽으로 이동: 목표(1.2rem) - 자연(4.6rem) = -3.4rem → -translate-x-[3.4rem]
 *
 * transition-all로 translate 값과 padding, background, text-color 모두 보간 처리
 */
const TeamPostStatusToggle = ({ isClosed, onClick }: TeamPostStatusToggleProps) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-[0.6rem] rounded-[9.9rem] cursor-pointer transition-all duration-300 ${
        isClosed
          ? 'py-[0.6rem] pl-[0.4rem] pr-[1.2rem] justify-center bg-[#E7E8EA]'
          : 'py-[0.6rem] pl-[1.2rem] pr-[0.4rem] justify-center bg-blue-70'
      }`}
    >
      {/* 원: 마감 시 translate 없음, 모집 시 오른쪽으로 4.2rem 이동 */}
      <div
        className={`w-[2.8rem] h-[2.8rem] flex-shrink-0 aspect-square bg-black-5 rounded-full transition-transform duration-300 ${
          isClosed ? 'translate-x-0' : 'translate-x-[4.2rem]'
        }`}
      />
      {/* 텍스트: 마감 시 translate 없음, 모집 시 왼쪽으로 3.4rem 이동 */}
      <span
        className={`w-[3.6rem] flex-shrink-0 text-center text-[1.4rem] font-[700] leading-[1.5] tracking-[-0.028rem] transition-all duration-300 ${
          isClosed ? 'translate-x-0 text-[#B7B9C0]' : '-translate-x-[3.4rem] text-black-5'
        }`}
      >
        {isClosed ? '마감' : '모집'}
      </span>
    </div>
  );
};

export default TeamPostStatusToggle;
