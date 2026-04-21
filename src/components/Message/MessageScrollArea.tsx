import type { RefObject } from 'react';
import TagDate from '../common/Tag/index';
import MessageBubble from './MessageBubble';
import type { GroupedMessages } from '../../hooks/useChatLogic';

interface MessageScrollAreaProps {
  scrollRef: RefObject<HTMLDivElement | null>;
  onScroll: () => void;
  isFetchingPreviousPage: boolean;
  groupedMessages: GroupedMessages[];
  failedTempIds: number[];
  variant?: 'default' | 'modal';
  withAnchors?: boolean;
  className?: string;
  partnerId?: string;
}

const MessageScrollArea = ({
  scrollRef,
  onScroll,
  isFetchingPreviousPage,
  groupedMessages,
  failedTempIds,
  variant = 'default',
  withAnchors = false,
  className,
  partnerId,
}: MessageScrollAreaProps) => (
  <div ref={scrollRef} onScroll={onScroll} className={className}>
    {isFetchingPreviousPage && (
      <div className="flex justify-center py-[1rem]">
        <span className="text-[1.2rem] text-black-50">이전 메시지 불러오는 중...</span>
      </div>
    )}
    {groupedMessages.map(({ date, bubbleGroups }) => (
      <div key={date} className="flex flex-col items-center gap-[1rem]">
        <TagDate size="sm" shape="circle" color="black80" isInverted isDisabled>
          {date}
        </TagDate>
        {bubbleGroups.map((group) => (
          <div key={group.key} className="w-full">
            {withAnchors &&
              group.messageIds.map((id) => <div key={id} id={`msg-${id}`} />)}
            {group.isMine ? (
              <MessageBubble
                isMine
                messages={group.contents}
                time={group.time}
                profileImageUrl={group.profileImageUrl}
                variant={variant}
                optimistic={
                  group.isTemp
                    ? {
                        tempId: String(group.key),
                        content: group.contents[0],
                        createdAt: new Date().toISOString(),
                        status: failedTempIds.includes(group.key) ? 'failed' : 'sending',
                      }
                    : undefined
                }
              />
            ) : (
              <MessageBubble
                isMine={false}
                messages={group.contents}
                time={group.time}
                profileImageUrl={group.profileImageUrl}
                variant={variant}
                partnerId={partnerId}
              />
            )}
          </div>
        ))}
      </div>
    ))}
  </div>
);

export default MessageScrollArea;
