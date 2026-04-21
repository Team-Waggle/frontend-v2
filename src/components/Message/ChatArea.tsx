import { useNavigate, useSearchParams } from 'react-router';

import MsgSendBtn from '../common/IconWrapper/index';
import MessageScrollArea from './MessageScrollArea';

import IcSend from '../../assets/icons/normal/ic_send.svg?react';
import IcProfileImg from '../../assets/icons/image/ic_character_circle_gray_60.svg?react';

import { useChatLogic } from '../../hooks/useChatLogic';

import { POSITION_CONVERTER } from '../../utils/position';

const ChatArea = ({ partnerId }: { partnerId: string }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlight = searchParams.get('highlight');

  const {
    scrollRef,
    isFetchingPreviousPage,
    partnerInfo,
    groupedMessages,
    failedTempIds,
    inputValue,
    setInputValue,
    handleScroll,
    handleSend,
    handleKeyDown,
  } = useChatLogic(partnerId, highlight);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      {/** 헤더 */}
      <header className="flex items-center gap-[0.7rem] self-stretch border-b border-solid border-black-30 p-[2.4rem]">
        <div className="flex items-center gap-[1rem]">
          {partnerInfo?.profileImageUrl ? (
            <img
              src={partnerInfo.profileImageUrl}
              alt="프로필"
              onClick={() => navigate(`/profile/${partnerId}`)}
              className="h-[4.4rem] w-[4.4rem] flex-shrink-0 cursor-pointer rounded-full object-cover"
            />
          ) : (
            <IcProfileImg
              onClick={() => navigate(`/profile/${partnerId}`)}
              className="h-[4.4rem] w-[4.4rem] flex-shrink-0 cursor-pointer rounded-full"
            />
          )}
          <div className="flex min-w-0 max-w-[20.4rem] flex-col items-start gap-[0.2rem]">
            <span className="text-[1.4rem] font-[500] leading-[1.5] tracking-[-0.028rem] text-black-100">
              {partnerInfo?.username ?? partnerId}
            </span>
            <span className="text-[1.2rem] font-[500] leading-[1.5] tracking-[-0.024rem] text-black-60">
              {partnerInfo?.position ? (POSITION_CONVERTER[partnerInfo.position] ?? partnerInfo.position) : undefined}
            </span>
          </div>
        </div>
      </header>

      {/** 메시지 목록 */}
      <MessageScrollArea
        scrollRef={scrollRef}
        onScroll={handleScroll}
        isFetchingPreviousPage={isFetchingPreviousPage}
        groupedMessages={groupedMessages}
        failedTempIds={failedTempIds}
        withAnchors
        partnerId={partnerId}
        className="flex flex-1 flex-col gap-[1rem] overflow-y-auto pb-[10rem] pl-[1.2rem] pr-[2.8rem] pt-[2rem] scrollbar-hide"
      />

      {/** 메시지 입력 */}
      <footer
        className="absolute bottom-0 right-0 flex w-full flex-col items-start gap-[1rem] bg-black-5 px-[1.2rem] py-[2.4rem] shadow-chat-input-box [clip-path:inset(-20px_-20px_-20px_0)]"
      >
        <div className="flex items-center gap-[2rem] self-stretch">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지 입력..."
            aria-label="메시지 입력"
            className="flex h-[4.4rem] flex-1 items-center gap-[1rem] rounded-[9.9rem] bg-black-10 py-[0.8rem] pl-[2.8rem] pr-[2.4rem] text-[1.4rem] font-[500] leading-[1.5] text-black-100 outline-none placeholder:text-black-50"
          />
          <MsgSendBtn onClick={handleSend} aria-label="메시지 전송">
            <IcSend />
          </MsgSendBtn>
        </div>
      </footer>
    </div>
  );
};

export default ChatArea;
