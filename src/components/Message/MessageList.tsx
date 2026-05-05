import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useGetConversations } from '../../hooks/useMessage';

import MessageListItem from './MessageListItem';
import MessageSearchBox from './MessageSearchBox';

const MessageList = () => {
  const navigate = useNavigate();
  const { partnerId } = useParams<{ partnerId: string }>();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetConversations(debouncedQuery || undefined);

  const conversations = data?.pages.flatMap((page) => page.data) ?? [];

  const handleClickConversation = (userId: string, messageId: number) => {
    if (debouncedQuery) {
      navigate(`/message/${userId}?highlight=${messageId}`);
    } else {
      navigate(`/message/${userId}`);
    }
  };

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
    <div className="flex h-full min-h-screen w-[38rem] flex-shrink-0 flex-col items-start gap-[1.7rem] border-r border-solid border-black-20 bg-black-5 p-[2.2rem]">
      <h1 className="text-[1.6rem] font-[600] leading-[1.5] tracking-[-0.032rem] text-black-100">
        메시지
      </h1>
      <MessageSearchBox value={query} onChange={setQuery} />
      {isLoading && (
        <div className="flex w-full flex-1 items-center justify-center">
          <span className="text-[1.4rem] font-[500] text-black-60">
            불러오는 중...
          </span>
        </div>
      )}
      {!isLoading && isError && (
        <div className="flex w-full flex-1 flex-col items-center justify-center self-stretch">
          <span className="text-[1.4rem] font-[500] leading-[1.5] tracking-[-0.028rem] text-black-60">
            검색 중 오류가 발생했습니다.
          </span>
        </div>
      )}
      {!isLoading && !isError && conversations.length === 0 && (
        <div className="flex w-full flex-1 flex-col items-center justify-center self-stretch">
          <span className="text-[1.6rem] font-[500] leading-[1.5] tracking-[-0.032rem] text-black-60">
            {debouncedQuery
              ? '검색 결과가 없습니다.'
              : '대화 중인 메시지가 없습니다.'}
          </span>
        </div>
      )}
      {!isLoading && !isError && conversations.length > 0 && (
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex w-full flex-col overflow-y-auto"
        >
          <ul>
            {conversations.map((conversation) => (
              <MessageListItem
                key={conversation.partner.userId}
                conversation={conversation}
                isSelected={partnerId === conversation.partner.userId}
                onClick={() =>
                  handleClickConversation(
                    conversation.partner.userId,
                    conversation.lastMessage.messageId,
                  )
                }
              />
            ))}
          </ul>
          {isFetchingNextPage && (
            <div className="flex w-full justify-center py-[1rem]">
              <span className="text-[1.2rem] font-[500] text-black-60">
                불러오는 중...
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageList;
