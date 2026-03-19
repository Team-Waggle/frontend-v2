import { useNavigate } from 'react-router-dom';

import IcCharacterNoPost from '../../../assets/icons/ic_character_main_page.svg?react';

import BaseButton from '../Button';

interface EmptyPageProps {
  className?: string;
}

const PostEmptyPage = ({ className }: EmptyPageProps) => {
  const navigate = useNavigate();

  return (
    <div
      className={`flex h-[64rem] w-full max-w-[152.6rem] items-center justify-center ${className ?? ''}`}
    >
      <div className="flex w-[25.8rem] flex-col items-center gap-[2.8rem]">
        <div className="flex w-[20rem] flex-col items-center gap-[1.8rem]">
          <IcCharacterNoPost />
          <div className="flex flex-col items-center gap-[0.4rem] self-stretch">
            <span className="text-[2rem] font-[600] leading-[1.5] tracking-[-0.04rem] text-black-90">
              등록된 모집글이 없습니다.
            </span>
            <span className="text-[1.6rem] font-[500] leading-[1.5] tracking-[-0.032rem] text-black-80">
              새로운 팀원을 찾아보세요!
            </span>
          </div>
        </div>
        <BaseButton
          color="secondary"
          className="w-full"
          onClick={() => navigate('/post/new')}
        >
          모집글 작성
        </BaseButton>
      </div>
    </div>
  );
};

export default PostEmptyPage;
