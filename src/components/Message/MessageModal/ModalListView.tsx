import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import IconWrapper from '../../common/IconWrapper';
import MessageListItem from '../MessageListItem';

import IcExpand from '../../../assets/icons/normal/ic_full.svg?react';
import IcClose from '../../../assets/icons/normal/ic_close.svg?react';

import { useMessageModalStore } from '../../../stores/messageModalStore';
import { useGetConversations } from '../../../hooks/useMessage';

const ModalListView = () => {
  const navigate = useNavigate();
  const { close, setPartnerId } = useMessageModalStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetConversations();

  const conversations = data?.pages.flatMap((page) => page.data) ?? [];

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (
      el.scrollHeight - el.scrollTop - el.clientHeight < 50 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  return (
    <>
      {/** 헤더 */}
      <header className="flex h-[5.6rem] w-[36rem] flex-shrink-0 items-center gap-[0.8rem] border-b border-solid border-black-30 py-[1.2rem] pl-[2.2rem] pr-[1.2rem]">
        <span className="flex-1 text-[1.6rem] font-[600] leading-[1.5] tracking-[-0.032rem] text-black-100">
          메시지
        </span>
        <div className="flex items-center">
          <IconWrapper
            color="transparent"
            className="hover:bg-hover-5"
            onClick={() => { navigate('/message'); close(); }}
          >
            <IcExpand />
          </IconWrapper>
          <IconWrapper color="transparent" className="hover:bg-hover-5" onClick={close}>
            <IcClose />
          </IconWrapper>
        </div>
      </header>

      {/** 대화 목록 */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex w-[36rem] flex-1 flex-col items-start overflow-y-auto scrollbar-hide"
      >
        {isLoading && (
          <div className="flex w-full flex-1 items-center justify-center">
            <span className="text-[1.4rem] font-[500] text-black-60">불러오는 중...</span>
          </div>
        )}
        {!isLoading && conversations.length === 0 && (
          <div className="flex w-full flex-1 items-center justify-center">
            <span className="text-[1.4rem] font-[500] text-black-60">대화 중인 메시지가 없습니다.</span>
          </div>
        )}
        {conversations.length > 0 && (
          <ul className="w-full">
            {conversations.map((conversation) => (
              <MessageListItem
                key={conversation.partner.userId}
                conversation={conversation}
                onClick={() => setPartnerId(conversation.partner.userId)}
              />
            ))}
          </ul>
        )}
        {isFetchingNextPage && (
          <div className="flex w-full justify-center py-[1rem]">
            <span className="text-[1.2rem] font-[500] text-black-60">불러오는 중...</span>
          </div>
        )}
      </div>
    </>
  );
};

export default ModalListView;
