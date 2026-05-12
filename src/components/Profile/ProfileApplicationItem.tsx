import { useState } from 'react';
import { Link } from 'react-router-dom';

import IcTeamDefaultImg from '../../assets/icons/image/ic_character_circle_gray_40.svg?react';
import IcChevronDown from '../../assets/icons/normal/chevron/ic_chevronDown.svg?react';
import IcLink from '../../assets/icons/normal/ic_link.svg?react';

import CustomBtn from '../../components/common/Button/index';

export type ApplicationStatus = '검토중' | '합류확정' | '불합격';

interface ProfileApplicationItemProps {
  postId: number;
  teamName: string;
  title: string;
  position: string;
  status: ApplicationStatus;
  appliedAt: string;
  onCancel: () => void;
  coverLetter?: string;
  portfolioUrl?: string;
}

const ProfileApplicationItem = ({
  postId,
  teamName,
  title,
  position,
  status,
  appliedAt,
  onCancel,
  coverLetter,
  portfolioUrl,
}: ProfileApplicationItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-start self-stretch border-t border-solid border-black-10">
      {/** 내용 컨테이너 */}
      <div className="flex items-center justify-between self-stretch py-[2.8rem]">
        {/** 팀명 / 제목 */}
        <Link to={`/post/${postId}`} className="group flex w-[40rem] cursor-pointer flex-col items-start gap-[1rem]">
          <div className="flex items-center gap-[0.8rem] self-stretch">
            <IcTeamDefaultImg className="h-[2.4rem] w-[2.4rem]" />
            <span className="line-clamp-1 overflow-hidden text-ellipsis text-[1.4rem] font-[500] leading-[1.5] tracking-[-0.028rem] text-black-90">
              {teamName}
            </span>
          </div>
          <div className="flex flex-wrap content-center items-center gap-[1.2rem] self-stretch">
            <span className="line-clamp-1 overflow-hidden text-ellipsis text-[1.8rem] font-[500] leading-[1.5] tracking-[-0.036rem] text-black-100 group-hover:underline">
              {title}
            </span>
          </div>
        </Link>
        {/** 직무 */}
        <div className="flex w-[7.7rem] items-center justify-center">
          <span className="line-clamp-1 overflow-hidden text-ellipsis text-[1.8rem] font-[600] leading-[1.5] tracking-[-0.036rem] text-black-90">
            {position}
          </span>
        </div>
        {/** 상태 */}
        <div className="flex w-[6.2rem] items-center justify-center">
          <span className={`line-clamp-1 overflow-hidden text-ellipsis text-[1.8rem] font-[700] leading-[1.5] tracking-[-0.036rem] ${status === '합류확정' ? 'text-blue-80' : status === '불합격' ? 'text-black-60' : 'text-blue-100'}`}>
            {status}
          </span>
        </div>
        {/** 지원일 */}
        <div className="flex w-[9.6rem] items-center justify-center">
          <span className="line-clamp-1 overflow-hidden text-ellipsis text-[1.7rem] font-[500] leading-[1.5] tracking-[-0.036rem] text-black-60">
            {appliedAt}
          </span>
        </div>
        {/** 취소 */}
        <div className="flex w-[12rem] items-center justify-center px-[2.8rem]">
          <CustomBtn size="sm" color="secondary" className="whitespace-nowrap" disabled={status !== '검토중'} onClick={onCancel}>
            지원취소
          </CustomBtn>
          {(coverLetter || portfolioUrl) && (
            <IcChevronDown
              className={`flex h-[1.6rem] w-[1.6rem] cursor-pointer text-black-50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              onClick={() => setIsOpen((prev) => !prev)}
            />
          )}
        </div>
      </div>
      {/** 지원내용 상세확인 */}
      {isOpen && (
        <div className="flex flex-col items-start gap-[1.2rem] self-stretch pb-[2rem]">
          <span className="line-clamp-4 self-stretch text-[1.3rem] font-[500] leading-[1.5] tracking-[-0.026rem] text-black-90">
            {coverLetter}
          </span>
          {portfolioUrl && (
            <div className="flex items-center gap-[0.4rem] self-stretch rounded-[0.6rem] bg-blue-5 px-[0.8rem] py-[1rem]">
              <div className="flex items-center gap-[0.2rem]">
                <IcLink className="h-[1.2rem] w-[1.2rem] text-black-90" />
                <span className="line-clamp-1 overflow-hidden text-ellipsis text-[1.3rem] font-[500] leading-[1.5] tracking-[-0.026rem] text-black-90">
                  첨부링크 :
                </span>
              </div>
              <a
                href={/^https?:\/\//i.test(portfolioUrl) ? portfolioUrl : `https://${portfolioUrl}`}
                target="_blank"
                rel="noreferrer"
                className="line-clamp-1 overflow-hidden text-ellipsis text-[1.3rem] font-[500] leading-[1.5] tracking-[-0.026rem] text-blue-60 underline"
              >
                {portfolioUrl}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileApplicationItem;
