import { useState } from 'react';
import IcProfileImg from '../../assets/icons/image/ic_character_circle_gray_60.svg?react';
import type { ConversationResponse } from '../../types/api/message';
import { formatConversationTime } from '../../utils/kst-time';
import { POSITION_CONVERTER } from '../../utils/position';

interface MessageListItemProps {
  conversation: ConversationResponse;
  isSelected?: boolean;
  onClick?: () => void;
}

const MessageListItem = ({
  conversation,
  isSelected,
  onClick,
}: MessageListItemProps) => {
  const { partner, lastMessage, unreadCount } = conversation;
  const hasUnread = unreadCount > 0;
  const [imgError, setImgError] = useState(false);

  return (
    <li>
      <button
        type="button"
        className={`group flex w-full cursor-pointer items-center justify-between rounded-[0.8rem] px-[1.2rem] py-[1.4rem] hover:bg-hover-5 ${isSelected ? 'bg-hover-5' : ''}`}
        onClick={onClick}
      >
        <div className="flex flex-1 items-center gap-[1rem]">
          {partner.profileImageUrl && !imgError ? (
            <img
              src={partner.profileImageUrl}
              alt={partner.username ?? '프로필'}
              className="h-[5.2rem] w-[5.2rem] flex-shrink-0 rounded-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <IcProfileImg className="h-[5.2rem] w-[5.2rem] flex-shrink-0 rounded-full" />
          )}
          <div className="flex min-w-0 max-w-[22.6rem] flex-1 flex-col items-start gap-[0.2rem]">
            <span className="text-[1.4rem] font-[500] leading-[1.5] tracking-[-0.028rem]">
              {partner.username ?? '알 수 없음'} |{' '}
              {POSITION_CONVERTER[partner.position] ?? partner.position}
            </span>
            <div className="flex min-w-0 items-center gap-[0.8rem] self-stretch">
              <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left text-[1.2rem] font-[500] leading-[1.5] tracking-[-0.024rem] text-black-60 group-hover:text-black-100">
                {lastMessage.content}
              </span>
              <div className="flex flex-shrink-0 items-center gap-[0.4rem]">
                <div className="aspect-square h-[0.2rem] w-[0.2rem] rounded-[9.9rem] bg-black-60" />
                <span className="text-[1rem] font-[500] leading-[1.5] tracking-[-0.02rem] text-black-60">
                  {lastMessage?.createdAt
                    ? formatConversationTime(lastMessage.createdAt)
                    : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
        {hasUnread && (
          <div className="aspect-square h-[0.8rem] w-[0.8rem] flex-shrink-0 rounded-[9.9rem] bg-blue-80" />
        )}
      </button>
    </li>
  );
};

export default MessageListItem;
