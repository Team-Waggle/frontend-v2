import { useState } from 'react';
import { useNavigate } from 'react-router';

import IcProfileImg from '../../assets/icons/image/ic_character_circle_gray_60.svg?react';
import type { OptimisticMessage } from '../../types/api/message';

type MessageBubbleProps =
  | {
      isMine: true;
      messages: string[];
      time: string;
      profileImageUrl?: string | null;
      variant?: 'default' | 'modal';
      optimistic?: OptimisticMessage;
      partnerId?: never;
    }
  | {
      isMine: false;
      messages: string[];
      time: string;
      profileImageUrl?: string | null;
      variant?: 'default' | 'modal';
      optimistic?: never;
      partnerId?: string;
    };

const MyBubble = ({
  messages,
  time,
  variant = 'default',
  optimistic,
}: {
  messages: string[];
  time: string;
  variant?: 'default' | 'modal';
  optimistic?: OptimisticMessage;
}) => {
  const isConsecutive = messages.length > 1;
  const maxW = variant === 'modal' ? 'max-w-[23.6rem]' : 'max-w-[36rem]';
  const textSize = variant === 'modal' ? 'text-[1.4rem]' : 'text-[1.6rem]';
  const isFailed = optimistic?.status === 'failed';
  const isSending = optimistic?.status === 'sending';

  return (
    <div className="flex flex-col items-end justify-center gap-[1rem] self-stretch py-[0.8rem]">
      <div className="inline-flex items-end gap-[0.8rem] px-[1.2rem] py-[0.8rem]">
        <div
          className={`flex flex-col items-end justify-center ${isConsecutive ? 'gap-[0.2rem]' : 'gap-[1rem] py-[0.4rem]'}`}
        >
          {messages.map((message, index) => {
            const isLast = index === messages.length - 1;
            return (
              <div
                key={index}
                className="flex flex-col items-end justify-center gap-[1rem] py-[0.4rem]"
              >
                <div className="flex items-end gap-[1rem]">
                  {isLast && (
                    <div className="flex flex-col items-end gap-[0.2rem]">
                      {isFailed && (
                        <span className="text-[1rem] font-[500] text-red-500">전송 실패</span>
                      )}
                      <span
                        className={`text-[1.2rem] font-[500] leading-[1.5] tracking-[-0.024rem] ${isSending ? 'text-black-30' : 'text-black-50'}`}
                      >
                        {isSending ? '전송 중...' : time}
                      </span>
                    </div>
                  )}
                  <div
                    className={`flex ${maxW} min-w-0 items-center gap-[1rem] rounded-[1rem] p-[1rem] ${isFailed ? 'bg-red-50' : 'bg-blue-10'}`}
                  >
                    <span
                      className={`${textSize} min-w-0 w-full font-[500] leading-[1.5] tracking-[-0.032rem] text-black-100 break-all whitespace-pre-wrap`}
                    >
                      {message}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const OpponentBubble = ({
  messages,
  time,
  profileImageUrl,
  variant = 'default',
  partnerId,
}: {
  messages: string[];
  time: string;
  profileImageUrl?: string | null;
  variant?: 'default' | 'modal';
  partnerId?: string;
}) => {
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();
  const isConsecutive = messages.length > 1;
  const maxW = variant === 'modal' ? 'max-w-[23.6rem]' : 'max-w-[36rem]';
  const textSize = variant === 'modal' ? 'text-[1.4rem]' : 'text-[1.6rem]';
  const profileSize = variant === 'modal' ? 'h-[3.6rem] w-[3.6rem]' : 'h-[5.2rem] w-[5.2rem]';

  const handleProfileClick = () => {
    if (partnerId) navigate(`/profile/${partnerId}`);
  };

  return (
    <div className="flex flex-col items-start gap-[1rem] self-stretch">
      <div className="inline-flex items-end gap-[0.8rem] px-[1.2rem] py-[0.8rem]">
        {profileImageUrl && !imgError ? (
          <img
            src={profileImageUrl}
            alt="프로필"
            onClick={handleProfileClick}
            className={`${profileSize} flex-shrink-0 rounded-full object-cover ${partnerId ? 'cursor-pointer' : ''}`}
            onError={() => setImgError(true)}
          />
        ) : (
          <IcProfileImg
            onClick={handleProfileClick}
            className={`${profileSize} rounded-full flex-shrink-0 ${partnerId ? 'cursor-pointer' : ''}`}
          />
        )}
        <div
          className={`flex flex-col items-start justify-center ${isConsecutive ? 'gap-[0.2rem]' : 'gap-[1rem] py-[0.4rem]'}`}
        >
          {messages.map((message, index) => {
            const isLast = index === messages.length - 1;
            return (
              <div
                key={index}
                className="flex flex-col items-start justify-center gap-[1rem] py-[0.4rem]"
              >
                <div className={`flex items-end gap-[1rem] ${isLast ? 'self-stretch' : ''}`}>
                  <div
                    className={`flex ${maxW} min-w-0 items-center gap-[1rem] rounded-[1rem] bg-black-10 p-[1rem]`}
                  >
                    <span
                      className={`${textSize} min-w-0 w-full font-[500] leading-[1.5] tracking-[-0.032rem] text-black-100 break-all whitespace-pre-wrap`}
                    >
                      {message}
                    </span>
                  </div>
                  {isLast && (
                    <span className="text-[1.2rem] font-[500] leading-[1.5] tracking-[-0.024rem] text-black-50">
                      {time}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const MessageBubble = (props: MessageBubbleProps) => {
  if (props.isMine) {
    return (
      <MyBubble
        messages={props.messages}
        time={props.time}
        variant={props.variant}
        optimistic={props.optimistic}
      />
    );
  }
  return (
    <OpponentBubble
      messages={props.messages}
      time={props.time}
      profileImageUrl={props.profileImageUrl}
      variant={props.variant}
      partnerId={props.partnerId}
    />
  );
};

export default MessageBubble;
