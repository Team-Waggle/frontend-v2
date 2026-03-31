import IcProfileImg from '../../assets/icons/image/ic_character_circle_gray_60.svg?react';

interface MessageBubbleProps {
  isMine: boolean;
  messages: string[];
  time: string;
  profileImage?: string;
  variant?: 'default' | 'modal';
}

const MyBubble = ({ messages, time, variant = 'default' }: { messages: string[]; time: string; variant?: 'default' | 'modal' }) => {
  const isConsecutive = messages.length > 1;
  const maxW = variant === 'modal' ? 'max-w-[23.6rem]' : 'max-w-[36rem]';
  const textSize = variant === 'modal' ? 'text-[1.4rem]' : 'text-[1.6rem]';

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
                    <span className="text-[1.2rem] font-[500] leading-[1.5] tracking-[-0.024rem] text-black-50">
                      {time}
                    </span>
                  )}
                  <div className={`flex ${maxW} items-center gap-[1rem] rounded-[1rem] bg-blue-10 p-[1rem]`}>
                    <span className={`${textSize} font-[500] leading-[1.5] tracking-[-0.032rem] text-black-100`}>
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
  variant = 'default',
}: {
  messages: string[];
  time: string;
  profileImage?: string;
  variant?: 'default' | 'modal';
}) => {
  const isConsecutive = messages.length > 1;
  const maxW = variant === 'modal' ? 'max-w-[23.6rem]' : 'max-w-[36rem]';
  const textSize = variant === 'modal' ? 'text-[1.4rem]' : 'text-[1.6rem]';
  const profileSize = variant === 'modal' ? 'h-[3.6rem] w-[3.6rem]' : 'h-[5.2rem] w-[5.2rem]';

  return (
    <div className="flex flex-col items-start gap-[1rem] self-stretch">
      <div className="inline-flex items-end gap-[0.8rem] px-[1.2rem] py-[0.8rem]">
        <IcProfileImg className={profileSize} />
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
                  <div className={`flex ${maxW} items-center gap-[1rem] rounded-[1rem] bg-black-10 p-[1rem]`}>
                    <span className={`${textSize} font-[500] leading-[1.5] tracking-[-0.032rem] text-black-100`}>
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

const MessageBubble = ({ isMine, messages, time, profileImage, variant }: MessageBubbleProps) => {
  return isMine ? (
    <MyBubble messages={messages} time={time} variant={variant} />
  ) : (
    <OpponentBubble messages={messages} time={time} profileImage={profileImage} variant={variant} />
  );
};

export default MessageBubble;
