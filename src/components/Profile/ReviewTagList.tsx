import { formatReviewTag } from '../../utils/review-tag';

interface ReviewTag {
  tag: string;
  count: number;
}

interface ReviewTagListProps {
  topLikeTags?: ReviewTag[];
}

const getReviewTagStyle = (isTop: boolean) => ({
  barColor: isTop ? 'bg-blue-40' : 'bg-blue-10',
  labelColor: isTop ? 'text-blue-100' : 'text-blue-70',
  countColor: isTop ? 'text-blue-100' : 'text-black-60',
});

const ReviewTagList = ({ topLikeTags }: ReviewTagListProps) => {
  const reviews = (topLikeTags ?? []).map(({ tag, count }, index) => ({
    label: formatReviewTag(tag),
    ...getReviewTagStyle(index === 0),
    count,
  }));

  return (
    <div className="flex flex-col items-start gap-[1.2rem] self-stretch">
      <h3 className="self-stretch text-[1.4rem] font-[700] leading-[1.5] tracking-[-0.028rem] text-black-90">
        이런점이 좋았어요!
      </h3>
      <div className="flex flex-col items-start gap-[0.8rem] self-stretch">
        {reviews.length === 0 ? (
          <div className="flex min-h-[12rem] flex-1 flex-col items-center justify-center gap-[1.2rem] self-stretch">
            <p className="overflow-hidden text-ellipsis text-center text-[1.4rem] font-[600] leading-[1.5] tracking-[-0.028rem] text-black-60">
              아직 받은 평판이 없어요.
            </p>
          </div>
        ) : (
          (() => {
            const maxCount = Math.max(...reviews.map((r) => r.count));
            return reviews.map(({ label, barColor, labelColor, countColor, count }) => (
              <div
                key={label}
                className="relative flex h-[4rem] items-center self-stretch rounded-[0.6rem] bg-black-10"
              >
                <div
                  className={`${barColor} flex items-center gap-[1rem] self-stretch rounded-l-[0.6rem] px-[1rem] ${count === maxCount ? 'rounded-r-[0.6rem]' : ''}`}
                  style={{
                    width: `${Math.max((count / maxCount) * 100, 15)}%`,
                  }}
                >
                  <span className={`${labelColor} text-[1.5rem] font-[800] leading-[1.5] tracking-[-0.03rem]`}>
                    # {label}
                  </span>
                </div>
                <span className={`${countColor} absolute right-[1rem] whitespace-nowrap text-[1.3rem] font-[700] leading-[1.5] tracking-[-0.026rem]`}>
                  {count}명
                </span>
              </div>
            ));
          })()
        )}
      </div>
    </div>
  );
};

export default ReviewTagList;
