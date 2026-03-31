import TagDate from '../components/common/Tag/index';
import MsgSendBtn from '../components/common/IconWrapper/index';

import MessageList from '../components/Message/MessageList';

import IcEmptyCharacter from '../assets/icons/ic_character_message_page.svg?react';
import IcSend from '../assets/icons/normal/ic_send.svg?react';

import MessageBubble from '../components/Message/MessageBubble';

const MessagePage = () => {
  return (
    <div className="flex h-full flex-1 flex-row">
      <MessageList />

      {/** 비어 있을 때 */}
      {/* <div className="flex flex-1 flex-col items-center justify-center gap-[1rem] self-stretch bg-black-10">
        <div className="flex flex-1 flex-col items-center justify-center gap-[2.8rem] self-stretch">
          <div className="flex flex-col items-center gap-[1.8rem]">
            <IcEmptyCharacter />
            <div className="flex flex-col items-center gap-[0.4rem] self-stretch">
              <span className="overflow-hidden text-ellipsis text-center text-[2rem] font-[600] leading-[1.5] tracking-[-0.04rem] text-black-90">
                메세지 내역이 없습니다.
              </span>
              <span className="text-center text-[1.6rem] font-[500] leading-[1.5] tracking-[-0.032rem] text-black-80">
                다른 사용자들과 자유롭게 대화를 나누어보세요.
                <br />
                궁금한 모집글이 있다면 메시지를 통해 문의할 수 있습니다.
              </span>
            </div>
          </div>
        </div>
      </div> */}
      {/** 비어 있지 않을 때 */}
      <div className="relative flex flex-1 flex-col items-center gap-[3.2rem]">
        {/** 닉네임 / 직무 */}
        <div className="flex items-center gap-[0.7rem] self-stretch border-b border-solid border-black-30 p-[2.4rem]">
          <div className="flex items-center gap-[1rem]">
            <div className="flex aspect-square h-[4.4rem] w-[4.4rem] flex-col items-center justify-center gap-[1rem] rounded-[9.9rem] bg-black-10" />
            <div className="flex w-[20.4rem] flex-col items-start gap-[0.2rem]">
              <span className="text-[1.4rem] font-[500] leading-[1.5] tracking-[-0.028rem] text-black-100">
                일이삼사오육칠팔구십
              </span>
              <span className="overflow-hidden text-ellipsis text-[1.2rem] font-[500] leading-[1.5] tracking-[-0.024rem] text-black-60">
                직무
              </span>
            </div>
          </div>
        </div>
        {/** 메세지 보내는 창 */}
        <div
          className="absolute bottom-0 right-0 flex w-full flex-col items-start gap-[1rem] bg-black-5 px-[1.2rem] py-[2.4rem]"
          style={{ boxShadow: '0 -2px 10px 0 rgba(0, 0, 0, 0.10)' }}
        >
          <div className="flex items-center gap-[2rem] self-stretch">
            <div className="flex h-[4.4rem] flex-1 items-center gap-[1rem] rounded-[9.9rem] bg-black-10 py-[0.8rem] pl-[2.8rem] pr-[2.4rem]">
              <span className="text-[1.4rem] font-[500] leading-[1.5] text-black-50">
                메시지 입력...
              </span>
            </div>
            <MsgSendBtn>
              <IcSend />
            </MsgSendBtn>
          </div>
        </div>
        {/** 메세지 내용 */}
        <div className="flex flex-col items-center gap-[1rem] self-stretch pl-[1.2rem] pr-[2.8rem]">
          {/** 날짜 태그 */}
          <TagDate
            size="sm"
            shape="circle"
            color="black80"
            isInverted
            isDisabled
          >
            YYYY.MM.DD{' '}
          </TagDate>
          {/** 상대 채팅 - 단독 메시지 (수:off 대상:on) */}
          <MessageBubble
            isMine={false}
            messages={['안녕하세요!']}
            time="14:30"
          />
          {/** 상대 채팅 - 연속 메시지 (수:on 대상:on) */}
          <MessageBubble
            isMine={false}
            messages={[
              '오늘 팀 프로젝트 어떻게 됐어요?',
              '같이 하실 분 구하시나요?',
              '같이 하실 분 구하시나요?',
            ]}
            time="14:31"
          />
          {/** 내 채팅 - 단독 메시지 (수:off 대상:off) */}
          <MessageBubble
            isMine={true}
            messages={['네, 아직 모집 중이에요!']}
            time="14:32"
          />
          {/** 내 채팅 - 연속 메시지 (수:on 대상:off) */}
          <MessageBubble
            isMine={true}
            messages={[
              '프론트엔드 포지션인데요.',
              '포트폴리오 있으시면 보내주세요.',
            ]}
            time="14:33"
          />
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
