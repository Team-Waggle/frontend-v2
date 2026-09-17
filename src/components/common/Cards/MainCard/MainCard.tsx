import { useEffect, useMemo, useState } from 'react';

import MainCardTag from './MainCardTag';
import { SkillIconLarge } from '../../../../utils/SkillIcon';
import { toSkillLabel } from '../../../../utils/skill';
import { POSITION_CONVERTER } from '../../../../utils/position';
import { formatDeadlineBadge } from '../../../../utils/kst-time';
import { formatCountBadge } from '../../../../utils/format';
import { useLikePost, useUnlikePost } from '../../../../hooks/usePost';
import { useAuthStore } from '../../../../stores/authStore';
import LoginModal from '../../../Modal/LoginModal';

import MeatBallIcon from '../../../../assets/icons/skill/large/ic_skill_meatball_large.svg?react';
import HeartIcon from '../../../../assets/icons/normal/ic_heart.svg?react';
import HeartFillIcon from '../../../../assets/icons/normal/ic_heart_fill.svg?react';
import EyeIcon from '../../../../assets/icons/normal/ic_eye.svg?react';

/**
 * Main Components: MainCard
 * 1. 해당 MainCard는 MainPage와 TeamHomePage에서 사용하는 MainCard입니다.
 *  1-1. variant로 main, team 을 구분했습니다.
 */

const toPositionLabel = (value: string): string => {
  const trimmed = (value || '').trim();
  return POSITION_CONVERTER[trimmed] || trimmed;
};

interface MainCardProps {
  postId?: number;
  mainCardTitle?: string;
  mainCardPositions?: string[];
  mainCardSkills?: string[];
  mainCardCreatedAt?: string;
  mainCardViewCount?: number;
  mainCardLikeCount?: number;
  mainCardDeadline?: string | null;
  variant?: 'main' | 'team';
  className?: string;
  isActive?: boolean;
  isClosed?: boolean;
  isLiked?: boolean;
  isMyPost?: boolean;
  onClick?: () => void;
  onLikeClick?: (nextIsLiked: boolean) => void;
}

const MainCard = ({
  postId,
  mainCardTitle,
  mainCardPositions,
  mainCardSkills,
  variant = 'main',
  isActive = false,
  isClosed = false,
  isLiked = false,
  isMyPost = false,
  mainCardCreatedAt,
  mainCardViewCount,
  mainCardLikeCount,
  mainCardDeadline,
  className,
  onClick,
  onLikeClick,
}: MainCardProps) => {
  const [liked, setLiked] = useState(isLiked);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const deadlineLabel = formatDeadlineBadge(mainCardDeadline);

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  const { accessToken } = useAuthStore();
  const { mutate: likePostMutate } = useLikePost();
  const { mutate: unlikePostMutate } = useUnlikePost();

  const handleLikeClick = () => {
    if (!accessToken) {
      setIsLoginModalOpen(true);
      return;
    }

    const nextIsLiked = !liked;
    setLiked(nextIsLiked);
    onLikeClick?.(nextIsLiked);

    if (!postId) return;

    const revert = () => setLiked(!nextIsLiked);

    if (nextIsLiked) {
      likePostMutate(postId, { onError: revert });
    } else {
      unlikePostMutate(postId, { onError: revert });
    }
  };

  const baseStyle =
    'pointer-events-auto flex w-full min-w-[33.6rem] max-sm:min-w-[32rem] cursor-pointer flex-col items-start gap-[3.2rem] rounded-[1.2rem] border border-solid border-black-30 bg-white px-[2.8rem] py-[2.4rem]';
  const hoverStyle =
    variant === 'main' ? 'hover:shadow-main-card' : 'hover:bg-hover-5';
  const activeStyle = isActive ? 'border-blue-70' : '';
  const closedStyle = isClosed ? 'opacity-50' : '';

  const uniquePositions = useMemo(() => {
    const list = (mainCardPositions || [])
      .map((j) => (j || '').trim())
      .filter(Boolean);

    return Array.from(new Set(list));
  }, [mainCardPositions]);

  return (
    <>
      <button
        type="button"
        data-main-card="true"
        className={`${baseStyle} ${hoverStyle} ${activeStyle} ${closedStyle} ${className}`}
        onClick={onClick}
      >
      {/** Frame 01 */}
      <div className="flex h-[9rem] min-w-[28rem] flex-col items-start gap-[1.6rem] self-stretch">
        {/** MainCard Title */}
        <div className="flex h-[4.6rem] max-h-[4.6rem] flex-shrink-0 items-start justify-between gap-[1.2rem] self-stretch overflow-hidden overflow-ellipsis">
          <span className="line-clamp-2 overflow-hidden text-ellipsis text-left text-[1.6rem] font-[600] leading-[1.5] tracking-[-0.032rem] text-[#0E0E0E]">
            {mainCardTitle}
          </span>
          {/** 하트 아이콘 Fill On / Off (내 게시글이면 숨김) */}
          {!isMyPost && (
            <span
              role="button"
              tabIndex={0}
              aria-pressed={liked}
              aria-label={liked ? '좋아요 취소' : '좋아요'}
              className="flex aspect-square h-[2rem] w-[2rem] shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                handleLikeClick();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLikeClick();
                }
              }}
            >
              {liked ? (
                <HeartFillIcon className="h-full w-full text-blue-60" />
              ) : (
                <HeartIcon className="h-full w-full text-black-100" />
              )}
            </span>
          )}
        </div>
        {/** MainCard Job Tag */}
        <div className="flex flex-wrap content-start items-start gap-[0.4rem] self-stretch">
          {uniquePositions.slice(0, 3).map((position) => (
            <MainCardTag key={position} TagTitle={toPositionLabel(position)} />
          ))}
          {uniquePositions.length > 3 ? <MeatBallIcon /> : null}
        </div>
      </div>

      {/** Frame 02 */}
      <div className="flex flex-col items-start gap-[1.6rem] self-stretch">
        {/* card-skill-box */}
        <div className="flex h-[2.8rem] items-center gap-[0.6rem] self-stretch">
          <div className="flex items-center gap-[0.6rem]">
            {(mainCardSkills || []).slice(0, 5).map((skill, index) => {
              const enumValue = (skill || '').trim();
              const iconName = toSkillLabel(enumValue);

              return (
                <SkillIconLarge
                  key={`${enumValue}-${iconName}-${index}`}
                  name={iconName}
                  className="h-[2.8rem] w-[2.8rem]"
                />
              );
            })}
            {(mainCardSkills || []).length > 5 ? <MeatBallIcon /> : null}
          </div>
        </div>
        {/* Time */}
        <div className="flex w-full items-center justify-between self-stretch">
          {/** 조회수 / 좋아요 */}
          <div className="flex flex-shrink items-center gap-[1.2rem]">
            <div className="flex items-center gap-[0.4rem]">
              <EyeIcon className="flex aspect-square h-[1.6rem] w-[1.6rem] flex-col items-center justify-center text-black-60" />
              <span className="overflow-hidden overflow-ellipsis text-[1.2rem] font-[500] leading-[1.5] tracking-[-0.024rem] text-black-60">
                {formatCountBadge(mainCardViewCount)}
              </span>
            </div>
            <div className="flex items-center gap-[0.4rem]">
              <HeartIcon className="flex aspect-square h-[1.6rem] w-[1.6rem] flex-col items-center justify-center text-black-60" />
              <span className="overflow-hidden overflow-ellipsis text-[1.2rem] font-[500] leading-[1.5] tracking-[-0.024rem] text-black-60">
                {formatCountBadge(mainCardLikeCount)}
              </span>
            </div>
          </div>
          {/** 마감기한 / 시간 */}
          <div className="flex flex-shrink items-center justify-end gap-[1.2rem]">
            {deadlineLabel && (
              <span className="overflow-hidden text-ellipsis text-[1.2rem] font-[500] leading-[1.5] tracking-[-0.024rem] text-black-80">
                {deadlineLabel}
              </span>
            )}
            <span className="text-[1.2rem] font-[500] text-black-60">
              {mainCardCreatedAt}
            </span>
          </div>
        </div>
      </div>
      </button>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default MainCard;
