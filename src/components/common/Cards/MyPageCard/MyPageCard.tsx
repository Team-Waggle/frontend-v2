import { useNavigate } from 'react-router-dom';

import IcUnlock from '../../../../assets/icons/normal/ic_lockOpen.svg?react';
import IcLock from '../../../../assets/icons/normal/ic_lock.svg?react';
import IcCrown from '../../../../assets/icons/normal/ic_crown.svg?react';
import IcPersons from '../../../../assets/icons/normal/ic_persons.svg?react';

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
}: MyPageCardProps) => {
  const isActive = status !== 'COMPLETED';
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (teamId !== undefined) navigate(`/team/${teamId}`);
  };

  return (
    <article
      className={`flex w-full max-w-[49.4rem] cursor-pointer items-start gap-[1.6rem] rounded-[1.6rem] border border-solid border-black-30 bg-black-5 p-[2.4rem] ${visible === false ? 'opacity-60' : ''}`}
      onClick={handleCardClick}
    >
      {/** 팀 이미지 */}
      {profileImageUrl ? (
        <img
          src={profileImageUrl}
          alt={title ?? '팀 프로필 이미지'}
          className="h-[12.4rem] w-[12.4rem] flex-shrink-0 rounded-[0.8rem] object-cover"
        />
      ) : (
        <div className="h-[12.4rem] w-[12.4rem] flex-shrink-0 rounded-[0.8rem] bg-black-20" />
      )}
      {/** 팀 상세 설명 */}
      <div className="flex min-w-0 flex-1 flex-col items-start gap-[1.6rem]">
        {/** 진행중 / 팀 이름 / 소속 직무 */}
        <div className="flex flex-col items-start gap-[0.8rem] self-stretch">
          {/** 진행중 / 잠금 */}
          <div className="flex items-center gap-[1rem] self-stretch">
            <div className="flex flex-1 items-start gap-[0.5rem]">
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
            {isMyProfile &&
              (visible ? (
                <IcUnlock
                  className="h-[2rem] w-[2rem] cursor-pointer text-black-40"
                  onClick={(e) => {
                    e.stopPropagation();
                    teamId !== undefined && onVisibilityToggle?.(teamId, false);
                  }}
                />
              ) : (
                <IcLock
                  className="h-[2rem] w-[2rem] cursor-pointer text-black-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    teamId !== undefined && onVisibilityToggle?.(teamId, true);
                  }}
                />
              ))}
          </div>
          {/** 팀명 / 소속 직무 */}
          <div className="flex flex-col items-start gap-[0.4rem] self-stretch">
            <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[1.8rem] font-[600] leading-[1.5] tracking-[-0.036rem] text-black-100">
              {title}
            </span>
            <span className="text-[1.4rem] font-[500] leading-[1.5] tracking-[-0.028rem] text-black-90">
              {position}
            </span>
          </div>
        </div>
        {/** 참여 인원 / 직급 */}
        <div className="flex flex-col items-start justify-end gap-[2.4rem] self-stretch">
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
  );
};

export default MyPageCard;
