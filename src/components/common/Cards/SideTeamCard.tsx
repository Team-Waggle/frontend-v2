import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../../../stores/authStore';
import LoginModal from '../../Modal/LoginModal';

import BaseButton from '../Button/index';

import IcCrown from '../../../assets/icons/tag/ic_crown.svg?react';
import IcShield from '../../../assets/icons/tag/ic_shield.svg?react';
import IcMe from '../../../assets/icons/tag/ic_me.svg?react';
import IcVertical from '../../../assets/icons/normal/ic_moreVertical_tight.svg?react';
import IcCharacter from '../../../assets/icons/image/ic_character_circle_gray_40.svg?react';

import SelectBox from '../SelectBox';
import IcSelectBoxShield from '../../../assets/icons/normal/ic_shield.svg?react';
import IcSelectBoxTrash from '../../../assets/icons/normal/ic_trash.svg?react';
import { SkillIcon } from '../../../utils/SkillIcon';
import { toSkillLabel } from '../../../utils/skill';
import ReviewModal from '../../Modal/ReviewModal';

interface SideTeamCardProps {
  memberId?: number | string;
  userId?: number | string;
  title?: string;
  position?: string;
  profileImageUrl?: string;
  skills?: string[];
  status?: string;
  variant?: 'team' | 'post';
  isMe?: boolean;
  isLeader?: boolean;
  isManager?: boolean;
  canManage?: boolean;
  isActive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  onAssignManager?: (memberId: number) => void;
  onDemoteManager?: (memberId: number) => void;
  onKickMember?: (memberId: number) => void;
}


const toPositionLabel = (position?: string): string => {
  if (position === 'PM') {
    return '기획';
  }

  if (position === 'DESIGNER') {
    return '디자인';
  }

  if (position === 'FRONTEND') {
    return '프론트엔드';
  }

  if (position === 'BACKEND') {
    return '백엔드';
  }

  if (position === 'MARKETER') {
    return '마케팅';
  }

  if (position === 'OTHER') {
    return '기타';
  }

  return position ?? '';
};

const SideTeamCard = ({
  memberId,
  userId,
  title = 'title',
  position = 'position',
  profileImageUrl,
  skills = [],
  variant = 'team',
  isMe = false,
  isLeader = false,
  isManager = false,
  canManage = false,
  isActive = false,
  disabled = false,
  status = 'ACTIVE',
  onClick,
  onAssignManager,
  onDemoteManager,
  onKickMember,
}: SideTeamCardProps) => {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const skillsIcon = Array.from(
    new Set(
      skills
        .map((skill) => toSkillLabel(skill))
        .filter((skillLabel): skillLabel is string => Boolean(skillLabel)),
    ),
  );

  const positionLabel = toPositionLabel(position);
  const [isSelectBoxOpen, setIsSelectBoxOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const selectBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isSelectBoxOpen) {
      return;
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (selectBoxRef.current && !selectBoxRef.current.contains(target)) {
        setIsSelectBoxOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSelectBoxOpen]);

  const baseStyle =
    'relative flex min-h-[27.2rem] w-[23.4rem] flex-col items-center gap-[2.4rem] rounded-[1.2rem] border border-solid border-black-30 bg-black-5 p-[2.8rem]';

  // TeamHome에서만 사용하는 SideTeamCard Style (hover, active, disabled)
  // const hoverStyle = 'hover:bg-black-20';
  const activeStyle = 'border-blue-70';
  const disabledStyle = 'bg-black-20';

  return (
    <>
      <div
        className={[
          baseStyle,
          'cursor-pointer',
          variant === 'team' && !disabled,
          isActive && activeStyle,
          disabled && disabledStyle,
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => navigate(`/profile/${userId ?? memberId}`)}
      >
        <div className="absolute flex w-[17.8rem] items-center justify-between">
          <div className="flex items-center gap-[0.4rem]">
            {variant === 'post' && <IcCrown />}
            {variant === 'team' && (
              <>
                {isLeader ? <IcCrown /> : isManager ? <IcShield /> : null}
                {isMe && <IcMe />}
              </>
            )}
          </div>
          <div
            ref={selectBoxRef}
            className="flex aspect-square h-[2.4rem] w-[2.4rem] flex-shrink-0 flex-col items-end justify-center gap-[1rem]"
          >
            {variant === 'team' && canManage && (
              <>
                <div
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSelectBoxOpen((prev) => !prev);
                  }}
                >
                  <IcVertical className="h-[2.4rem] text-black-50" />
                </div>

                {isSelectBoxOpen && (
                  <div
                    className="absolute right-0 top-0 z-[20]"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <SelectBox
                      items={[
                        {
                          icon: <IcSelectBoxShield className="h-[1.6rem] w-[1.6rem]" />,
                          label: isManager ? '관리자 취소' : '관리자 지정',
                          onClick: () => {
                            if (isManager) {
                              onDemoteManager?.(Number(memberId!));
                            } else {
                              onAssignManager?.(Number(memberId!));
                            }
                            setIsSelectBoxOpen(false);
                          },
                        },
                        {
                          icon: <IcSelectBoxTrash className="h-[1.6rem] w-[1.6rem]" />,
                          label: '내보내기',
                          onClick: () => {
                            onKickMember?.(Number(memberId!));
                            setIsSelectBoxOpen(false);
                          },
                          variant: 'danger',
                        },
                      ]}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div
          className={[
            'flex flex-col items-center self-stretch rounded-[0.6rem] pt-[1.2rem]',
            disabled && 'opacity-[0.4]',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div className="flex flex-col items-center gap-[1.7rem]">
            {profileImageUrl && !imgError ? (
              <img
                alt={'프로필 이미지'}
                src={profileImageUrl}
                className="h-[6.1rem] w-[6.1rem] rounded-[9.9rem] object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <IcCharacter className="h-[6.1rem] w-[6.1rem] rounded-[9.9rem]" />
            )}
            <div className="flex flex-col items-center gap-[0.4rem]">
              <span className="text-[1.6rem] font-[600] leading-[1.5] text-black-100">
                {title}
              </span>
              <span className="text-[1.4rem] font-[500] leading-[1.5] text-black-60">
                {positionLabel}
              </span>
            </div>
            <div className="flex items-start gap-[0.6rem]">
              {skillsIcon.slice(0, 3).map((skill) => (
                <div
                  key={skill}
                  className="flex aspect-square h-[3.2rem] w-[3.2rem] items-center justify-center gap-[1rem] rounded-[9.9rem] bg-black-10 p-[0.6rem]"
                >
                  <SkillIcon name={skill} className="" />
                </div>
              ))}
            </div>
          </div>
        </div>
        {variant === 'post' && (
          <BaseButton
            size="md"
            color="secondary"
            disabled={isMe}
            onClick={(e) => {
              e.stopPropagation();
              if (!accessToken) {
                setIsLoginModalOpen(true);
              } else {
                navigate(`/message/${memberId}`, {
                  state: { username: title, position, profileImageUrl },
                });
              }
            }}
          >
            문의하기
          </BaseButton>
        )}
        {variant === 'team' && status === 'COMPLETED' && (
          <BaseButton
            size="md"
            color="tertiary"
            disabled={isMe || disabled}
            onClick={(e) => {
              e.stopPropagation();
              setIsReviewModalOpen(true);
            }}
          >
            리뷰 쓰기
          </BaseButton>
        )}
      </div>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        memberId={memberId}
        username={title}
      />
    </>
  );
};

export default SideTeamCard;
