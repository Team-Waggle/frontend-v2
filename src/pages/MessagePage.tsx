import { useParams } from 'react-router';

import ChatArea from '../components/Message/ChatArea';

import IcEmptyCharacter from '../assets/icons/ic_character_message_page.svg?react';

const MessagePage = () => {
  const { partnerId } = useParams<{ partnerId: string }>();

  if (!partnerId) {
    return (
      <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-[1rem] self-stretch bg-black-10">
        <div className="flex flex-1 flex-col items-center justify-center gap-[2.8rem] self-stretch">
          <div className="flex flex-col items-center gap-[1.8rem]">
            <IcEmptyCharacter />
            <div className="flex flex-col items-center gap-[0.4rem] self-stretch">
              <span className="overflow-hidden text-ellipsis text-center text-[2rem] font-[600] leading-[1.5] tracking-[-0.04rem] text-black-90">
                대화 상대를 선택하세요
              </span>
              <span className="text-center text-[1.6rem] font-[500] leading-[1.5] tracking-[-0.032rem] text-black-80">
                사이드바의 메시지 메뉴에서 대화방을 선택해주세요.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-row overflow-hidden">
      <ChatArea partnerId={partnerId} />
    </div>
  );
};

export default MessagePage;
