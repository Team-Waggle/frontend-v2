import { useState } from 'react';
import { Link } from 'react-router-dom';

import IcTeamDefaultImg from '../../assets/icons/image/ic_character_circle_gray_40.svg?react';
import IcChevronDown from '../../assets/icons/normal/chevron/ic_chevronDown.svg?react';
import IcLink from '../../assets/icons/normal/ic_link.svg?react';

import CustomBtn from '../../components/common/Button/index';
import type { ApplicationStatusLabel } from '../../types/api/user';

interface ProfileApplicationItemProps {
  postId: number;
  teamName: string;
  title: string;
  position: string;
  status: ApplicationStatusLabel;
  appliedAt: string;
  onCancel: () => void;
  coverLetter?: string;
  portfolioUrls?: string[];
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
  portfolioUrls,
}: ProfileApplicationItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasDetail = !!(coverLetter || portfolioUrls?.length);

  return (
    <>
      <tr
        className={`flex items-center justify-between border-t border-solid border-t-black-10 px-[2rem] py-[2.8rem] max-sm:flex-col max-sm:items-stretch max-sm:gap-0 max-sm:px-0 max-sm:py-0 ${!isOpen ? 'border-b border-b-black-30' : ''}`}
      >
        {/** 팀명 / 제목 */}
        <td className="w-[40rem] max-sm:w-full max-sm:px-[2rem] max-sm:pt-[2.8rem]">
          <Link
            to={`/post/${postId}`}
            className="group flex cursor-pointer flex-col items-start gap-[1rem] overflow-hidden"
          >
            <div className="flex items-center gap-[0.8rem] self-stretch max-sm:items-start max-sm:gap-[1rem]">
              <IcTeamDefaultImg className="h-[2.4rem] w-[2.4rem] shrink-0 max-sm:h-[8.6rem] max-sm:w-[8.6rem] max-sm:flex-shrink-0" />
              {/** 데스크탑: 팀명만 */}
              <span className="line-clamp-1 overflow-hidden text-ellipsis text-[1.4rem] font-[500] leading-[1.5] tracking-[-0.028rem] text-black-90 max-sm:hidden">
                {teamName}
              </span>
              {/** 모바일: 상태 / 팀명 / 직무 스택 */}
              <div className="hidden flex-col gap-[0.8rem] max-sm:flex">
                <span
                  className={`text-[1.8rem] font-[700] leading-[1.5] tracking-[-0.036rem] ${status === '합류확정' ? 'text-blue-80' : status === '불합격' ? 'text-black-60' : 'text-blue-100'}`}
                >
                  {status}
                </span>
                <div className="flex flex-col gap-[0.2rem]">
                  <span className="text-[1.4rem] font-[500] leading-[1.5] tracking-[-0.028rem] text-black-90">
                    {teamName}
                  </span>
                  <span className="text-[1.8rem] font-[600] leading-[1.5] tracking-[-0.036rem] text-black-90">
                    {position}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap content-center items-center gap-[1.2rem] self-stretch">
              <span className="line-clamp-1 overflow-hidden text-ellipsis text-[1.8rem] font-[500] leading-[1.5] tracking-[-0.036rem] text-black-100 group-hover:underline max-sm:line-clamp-2">
                {title}
              </span>
            </div>
          </Link>
        </td>
        {/** 직무 - 데스크탑만 */}
        <td className="w-[7.7rem] text-center max-sm:hidden">
          <span className="whitespace-nowrap text-[1.8rem] font-[600] leading-[1.5] tracking-[-0.036rem] text-black-90">
            {position}
          </span>
        </td>
        {/** 상태 - 데스크탑만 */}
        <td className="w-[6.2rem] text-center max-sm:hidden">
          <span
            className={`whitespace-nowrap text-[1.8rem] font-[700] leading-[1.5] tracking-[-0.036rem] ${status === '합류확정' ? 'text-blue-80' : status === '불합격' ? 'text-black-60' : 'text-blue-100'}`}
          >
            {status}
          </span>
        </td>
        {/** 지원일 - 데스크탑만 */}
        <td className="w-[9.6rem] text-center max-sm:hidden">
          <span className="line-clamp-1 overflow-hidden text-ellipsis text-[1.7rem] font-[500] leading-[1.5] tracking-[-0.036rem] text-black-60">
            {appliedAt}
          </span>
        </td>
        {/** 취소 / 상세 토글 */}
        <td className="w-[12rem] max-sm:w-full max-sm:px-[2rem] max-sm:pb-[2.8rem] max-sm:pt-[1.6rem]">
          <div className="flex items-center justify-between max-sm:gap-[1.6rem]">
            <CustomBtn
              size="sm"
              color="secondary"
              className="whitespace-nowrap max-sm:flex-1"
              disabled={status !== '검토중'}
              onClick={onCancel}
            >
              지원취소
            </CustomBtn>
            <button
              type="button"
              aria-label="지원 내용 상세보기"
              aria-expanded={isOpen}
              className={!hasDetail ? 'invisible' : ''}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <IcChevronDown
                className={`flex h-[1.6rem] w-[1.6rem] text-black-50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        </td>
      </tr>
      {isOpen && (
        <tr className="flex border-b border-solid border-b-black-30 px-[2rem] max-sm:px-0">
          <td className="flex-1 pb-[2rem] max-sm:px-[2rem]">
            <div className="flex flex-col items-start gap-[1.2rem]">
              <span className="line-clamp-4 self-stretch text-[1.3rem] font-[500] leading-[1.5] tracking-[-0.026rem] text-black-90">
                {coverLetter}
              </span>
              {portfolioUrls?.map((url) => (
                <div
                  key={url}
                  className="flex items-center gap-[0.4rem] self-stretch rounded-[0.6rem] bg-blue-5 px-[0.8rem] py-[1rem]"
                >
                  <div className="flex items-center gap-[0.2rem]">
                    <IcLink className="h-[1.2rem] w-[1.2rem] text-black-90" />
                    <span className="line-clamp-1 overflow-hidden text-ellipsis text-[1.3rem] font-[500] leading-[1.5] tracking-[-0.026rem] text-black-90">
                      첨부링크 :
                    </span>
                  </div>
                  <a
                    href={/^https?:\/\//i.test(url) ? url : `https://${url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="line-clamp-1 overflow-hidden text-ellipsis text-[1.3rem] font-[500] leading-[1.5] tracking-[-0.026rem] text-blue-60 underline"
                  >
                    {url}
                  </a>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default ProfileApplicationItem;
