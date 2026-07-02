import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import IcEye from '../../../../assets/icons/normal/ic_eye.svg?react';
import IcEyeSlash from '../../../../assets/icons/normal/ic_eye_slash.svg?react';

import IcCrown from '../../../../assets/icons/normal/ic_crown.svg?react';
import IcKebab from '../../../../assets/icons/normal/ic_moreVertical.svg?react';
import IcPersons from '../../../../assets/icons/normal/ic_persons.svg?react';
import IcTrash from '../../../../assets/icons/normal/ic_trash.svg?react';
import IcTeamImg from '../../../../assets/icons/image/ic_character_circle_primary_60.svg?react';

import SelectBox from '../../SelectBox';

interface MyPageCardProps {
  title?: string;
  position?: string;
  memberCount?: number;
  isLeader?: boolean;
  profileImageUrl?: string;
  status?: 'PREPARING' | 'ACTIVE' | 'COMPLETED';
  isMyProfile?: boolean;
  visible?: boolean;
  teamId?: number;
  onVisibilityToggle?: (teamId: number, visible: boolean) => void;
  onLeaveTeam?: (teamId: number) => void;
}

const MyPageCard = ({
  title,
  position,
  memberCount,
  isLeader,
  profileImageUrl,
  status,
  isMyProfile,
  visible,
  teamId,
  onVisibilityToggle,
  onLeaveTeam,
}: MyPageCardProps) => {
  const isActive = status !== 'COMPLETED';
  const [isSelectBoxOpen, setIsSelectBoxOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const selectBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isSelectBoxOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target instanceof Node)) return;
      if (selectBoxRef.current && !selectBoxRef.current.contains(e.target)) {
        setIsSelectBoxOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSelectBoxOpen]);

  return (
    <Link
      to={teamId !== undefined ? `/team/${teamId}` : '/'}
      className="block w-full max-w-[49.4rem] max-sm:max-w-full"
      onClick={teamId === undefined ? (e) => e.preventDefault() : undefined}
    >
    <article
      className="flex w-full cursor-pointer items-start gap-[1.6rem] rounded-[1.6rem] border border-solid border-black-30 bg-black-5 p-[2.4rem]"
    >
      {/** 팀 이미지 */}
      {profileImageUrl && !imgError ? (
        <img
          src={profileImageUrl}
          alt={title ?? '팀 프로필 이미지'}
          className={`h-[12.4rem] w-[12.4rem] flex-shrink-0 rounded-[0.8rem] object-cover max-xs:h-[8.4rem] max-xs:w-[8.4rem] ${!visible && isMyProfile && 'opacity-60'}`}
          onError={() => setImgError(true)}
        />
      ) : (
        <IcTeamImg className={`h-[12.4rem] w-[12.4rem] flex-shrink-0 rounded-[0.6rem] bg-blue-5 max-xs:h-[8.4rem] max-xs:w-[8.4rem] ${!visible && isMyProfile && 'opacity-60'}`} />
      )}
      {/** 팀 상세 설명 */}
      <div className="flex min-w-0 flex-1 flex-col items-start gap-[1.6rem]">
        {/** 진행중 / 팀 이름 / 소속 직무 */}
        <div className="flex flex-col items-start gap-[0.8rem] self-stretch">
          {/** 진행중 / 잠금 */}
          <div className="flex items-center gap-[1rem] self-stretch">
            <div className={`flex flex-1 items-start gap-[0.5rem] ${!visible && isMyProfile && 'opacity-60'}`}>
              <div
                className={`flex h-[2.4rem] items-center gap-[0.4rem] rounded-[0.4rem] border border-solid px-[0.8rem] ${isActive ? 'border-blue-30' : 'border-black-30'}`}
              >
                <span
                  className={`text-[1.2rem] font-[600] leading-[1.5] tracking-[-0.024rem] ${isActive ? 'text-blue-80' : 'text-black-80'}`}
                >
                  {isActive ? '진행중' : '완료'}
                </span>
              </div>
            </div>
            {isMyProfile && (
              <div ref={selectBoxRef} className="relative">
                <IcKebab
                  className="h-[2rem] w-[2rem] cursor-pointer text-black-50"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsSelectBoxOpen((prev) => !prev);
                  }}
                />
                {isSelectBoxOpen && (
                  <div
                    className="absolute right-0 top-0 z-[20]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <SelectBox
                      items={[
                        {
                          icon: visible
                            ? <IcEyeSlash className="h-[1.6rem] w-[1.6rem]" />
                            : <IcEye className="h-[1.6rem] w-[1.6rem]" />,
                          label: visible ? '비공개' : '공개',
                          onClick: () => {
                            teamId !== undefined && onVisibilityToggle?.(teamId, !visible);
                            setIsSelectBoxOpen(false);
                          },
                        },
                        ...(!isLeader ? [{
                          icon: <IcTrash className="h-[1.6rem] w-[1.6rem]" />,
                          label: '탈퇴하기',
                          onClick: () => {
                            teamId !== undefined && onLeaveTeam?.(teamId);
                            setIsSelectBoxOpen(false);
                          },
                          variant: 'danger' as const,
                        }] : []),
                      ]}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          {/** 팀명 / 소속 직무 */}
          <div className={`flex flex-col items-start gap-[0.4rem] self-stretch ${!visible && isMyProfile && 'opacity-60'}`}>
            <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[1.8rem] font-[600] leading-[1.5] tracking-[-0.036rem] text-black-100">
              {title}
            </span>
            <span className="text-[1.4rem] font-[500] leading-[1.5] tracking-[-0.028rem] text-black-90">
              {position}
            </span>
          </div>
        </div>
        {/** 참여 인원 / 직급 */}
        <div className={`flex flex-col items-start justify-end gap-[2.4rem] self-stretch ${!visible && isMyProfile && 'opacity-60'}`}>
          <div className="flex h-[2.4rem] items-center gap-[0.8rem] self-stretch">
            <div className="flex h-[2.4rem] items-center gap-[0.4rem] rounded-[0.4rem] bg-black-10 px-[0.8rem]">
              <IcPersons className="h-[1.6rem] w-[1.6rem]" />
              <span className="whitespace-nowrap text-[1rem] font-[500] leading-[1.5] tracking-[-0.02rem] text-black-80">
                {memberCount}명 참여중
              </span>
            </div>
            {isLeader && (
              <div className="flex h-[2.4rem] items-center gap-[0.4rem] rounded-[0.4rem] bg-black-10 px-[0.8rem]">
                <IcCrown className="h-[1.6rem] w-[1.6rem]" />
                <span className="whitespace-nowrap text-[1rem] font-[500] leading-[1.5] tracking-[-0.02rem] text-black-80">
                  팀장
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
    </Link>
  );
};

export default MyPageCard;
