import { useNavigate } from 'react-router-dom';

import IconWrapper from '../../common/IconWrapper';
import MessageScrollArea from '../MessageScrollArea';

import IcExpand from '../../../assets/icons/normal/ic_full.svg?react';
import IcClose from '../../../assets/icons/normal/ic_close.svg?react';
import IcSend from '../../../assets/icons/normal/ic_send.svg?react';
import IcBack from '../../../assets/icons/normal/chevron/ic_chevronLeft.svg?react';
import IcProfileImg from '../../../assets/icons/image/ic_character_circle_gray_60.svg?react';

import { useMessageModalStore } from '../../../stores/messageModalStore';
import { useChatLogic } from '../../../hooks/useChatLogic';

const ModalChatView = ({ partnerId }: { partnerId: string }) => {
  const navigate = useNavigate();
  const { close, setPartnerId } = useMessageModalStore();

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
  } = useChatLogic(partnerId);

  return (
    <>
      {/** 헤더 */}
      <header className="flex h-[5.6rem] w-[36rem] flex-shrink-0 items-center gap-[0.8rem] border-b border-solid border-black-30 py-[1.2rem] pl-[1.2rem] pr-[1.2rem]">
        <IconWrapper color="transparent" className="hover:bg-hover-5" onClick={() => setPartnerId(null)}>
          <IcBack />
        </IconWrapper>
        {partnerInfo?.profileImageUrl ? (
          <img
            src={partnerInfo.profileImageUrl}
            alt="프로필"
            className="h-[3.2rem] w-[3.2rem] flex-shrink-0 rounded-full object-cover"
          />
        ) : (
          <IcProfileImg className="h-[3.2rem] w-[3.2rem] flex-shrink-0 rounded-full" />
        )}
        <span className="flex-1 text-[1.4rem] font-[600] leading-[1.5] tracking-[-0.028rem] text-black-100">
          {partnerInfo?.username ?? partnerId}
        </span>
        <div className="flex items-center">
          <IconWrapper
            color="transparent"
            className="hover:bg-hover-5"
            onClick={() => { navigate(`/message/${partnerId}`); close(); }}
          >
            <IcExpand />
          </IconWrapper>
          <IconWrapper color="transparent" className="hover:bg-hover-5" onClick={close}>
            <IcClose />
          </IconWrapper>
        </div>
      </header>

      {/** 메시지 목록 */}
      <MessageScrollArea
        scrollRef={scrollRef}
        onScroll={handleScroll}
        isFetchingPreviousPage={isFetchingPreviousPage}
        groupedMessages={groupedMessages}
        failedTempIds={failedTempIds}
        variant="modal"
        className="flex w-[36rem] flex-1 flex-col gap-[1rem] overflow-y-auto py-[1.2rem] pt-[1.6rem] scrollbar-hide"
      />

      {/** 메시지 입력 */}
      <footer
        className="flex w-[36rem] items-start gap-[1rem] rounded-b-[2rem] bg-black-5 p-[1rem]"
        style={{ boxShadow: '0 -2px 10px 0 rgba(0, 0, 0, 0.10)' }}
      >
        <div className="flex w-full items-center gap-[2rem] self-stretch">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지 입력..."
            aria-label="메시지 입력"
            className="flex h-[4.4rem] flex-1 items-center gap-[1rem] rounded-[9.9rem] bg-black-10 py-[0.8rem] pl-[2.8rem] pr-[2.4rem] text-[1.4rem] font-[500] leading-[1.5] text-black-100 outline-none placeholder:text-black-50"
          />
          <IconWrapper onClick={handleSend} aria-label="메시지 전송">
            <IcSend />
          </IconWrapper>
        </div>
      </footer>
    </>
  );
};

export default ModalChatView;
