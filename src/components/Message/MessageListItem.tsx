import IcProfileImg from '../../assets/icons/image/ic_character_circle_gray_60.svg?react';

const MessageListItem = () => {
  return (
    <div className="flex w-full cursor-pointer items-center gap-[0.7rem] px-[1.2rem] py-[1.4rem] hover:bg-hover-5">
      <div className="flex flex-1 items-center gap-[1rem]">
        <IcProfileImg className="h-[5.2rem] w-[5.2rem]" />
        <div className="flex w-[20.4rem] flex-col items-start gap-[0.2rem]">
          <div className="flex items-center gap-[0.6rem]">
            <span className="text-[1.4rem] font-[500] leading-[1.5] tracking-[-0.028rem]">
              일이삼사오육칠팔구십
            </span>
            <span className="text-[1.4rem] font-[500] leading-[1.5] tracking-[-0.028rem]">
              |
            </span>
            <span className="text-[1.4rem] font-[500] leading-[1.5] tracking-[-0.028rem]">
              프론트엔드
            </span>
          </div>
          <div className="flex items-center gap-[0.8rem] self-stretch">
            <span className="block flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[1.2rem] font-[500] leading-[1.5] tracking-[-0.024rem] text-black-60">
              마지막 메시지 내용이 노출됩니다.
            </span>
            <div className="flex items-center gap-[0.4rem]">
              <div className="aspect-square h-[0.2rem] w-[0.2rem] rounded-[9.9rem] bg-black-60" />
              <span className="text-[1rem] font-[500] leading-[1.5] tracking-[-0.02rem] text-black-60">
                24시간 전
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="aspect-square h-[0.8rem] w-[0.8rem] flex-shrink-0 rounded-[9.9rem] bg-blue-80" />
    </div>
  );
};

export default MessageListItem;
