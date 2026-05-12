import IcCharacterNoPost from '../../../assets/icons/ic_character_main_page.svg?react';

import BaseButton from '../Button';

interface EmptyPageProps {
  title?: string;
  subTitle?: string;
  btnText?: string;
  className?: string;
  onBtnClick?: () => void;
}

const PostEmptyPage = ({ className, title, subTitle, btnText, onBtnClick }: EmptyPageProps) => {
  return (
    <div
      className={`flex h-[64rem] w-full max-w-[152.6rem] items-center justify-center ${className ?? ''}`}
    >
      <div className="flex w-[25.8rem] flex-col items-center gap-[2.8rem]">
        <div className="flex w-[20rem] flex-col items-center gap-[1.8rem]">
          <IcCharacterNoPost />
          <div className="flex flex-col items-center gap-[0.4rem] self-stretch">
            <p className="text-[2rem] font-[600] leading-[1.5] tracking-[-0.04rem] text-black-90">
              {title}
            </p>
            <p className="text-[1.6rem] font-[500] leading-[1.5] tracking-[-0.032rem] text-black-80">
              {subTitle}
            </p>
          </div>
        </div>
        {btnText && (
          <BaseButton
            color="secondary"
            className="w-full"
            onClick={onBtnClick}
          >
            {btnText}
          </BaseButton>
        )}
      </div>
    </div>
  );
};

export default PostEmptyPage;
