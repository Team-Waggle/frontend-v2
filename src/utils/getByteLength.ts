// 한글 3byte, 이모지 4byte, 나머지 1byte로 계산하는 함수
export const getByteLength = (str: string) => {
  const segmenter = new Intl.Segmenter('ko', { granularity: 'grapheme' });
  let total = 0;

  for (const { segment } of segmenter.segment(str)) {
    if (/\p{Extended_Pictographic}/gu.test(segment)) {
      total += 4;
    } else if (/[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(segment)) {
      total += 3;
    } else {
      total += 1;
    }
  }

  return total;
};

// 보통의 byte 계산, 기존의 이모지들의 byte로 계산함 (모든 이모지 4byte 계산으로 하지않음)
// export const getByteLength = (str: string): number => {
//   return new TextEncoder().encode(str).length;
// };
