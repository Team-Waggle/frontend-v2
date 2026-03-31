import { useNavigate } from 'react-router-dom';

import TagDate from '../../common/Tag/index';
import IconWrapper from '../../common/IconWrapper';

import MessageBubble from '../MessageBubble';
import MessageListItem from '../MessageListItem';

import IcExpand from '../../../assets/icons/normal/ic_full.svg?react';
import IcClose from '../../../assets/icons/normal/ic_close.svg?react';
import IcSend from '../../../assets/icons/normal/ic_send.svg?react';

import { useMessageModalStore } from '../../../stores/messageModalStore';

const MessageModal = () => {
  const { close } = useMessageModalStore();
  const navigate = useNavigate();
  return (
    <div className="flex h-[51.6rem] w-[36rem] flex-col items-start rounded-[2rem] bg-black-5 shadow-[0_0_20px_0_rgba(0,0,0,0.20)] backdrop-blur-[32px]">
      <div className="flex h-[5.6rem] w-[36rem] flex-shrink-0 items-center gap-[0.8rem] border-b border-solid border-black-30 py-[1.2rem] pl-[2.2rem] pr-[1.2rem]">
        <span className="flex-1 text-[1.6rem] font-[600] leading-[1.5] tracking-[-0.032rem] text-black-100">
          메시지
        </span>
        <div className="flex items-center">
          <IconWrapper color="transparent" className="hover:bg-hover-5" onClick={() => { navigate('/message'); close(); }}>
            <IcExpand />
          </IconWrapper>
          <IconWrapper
            color="transparent"
            className="hover:bg-hover-5"
            onClick={close}
          >
            <IcClose />
          </IconWrapper>
        </div>
      </div>
      {/** 메세지 리스트 */}
      {/* <div className="flex w-[36rem] flex-col items-start overflow-y-auto scrollbar-hide">
                <MessageListItem /><MessageListItem /><MessageListItem /><MessageListItem /><MessageListItem /><MessageListItem /><MessageListItem />
            </div> */}
      {/** 메세지 내용 */}
      <div className="flex w-[36rem] flex-1 flex-col items-center gap-[1rem] overflow-y-auto py-[1.2rem] pt-[1.6rem] scrollbar-hide">
        {/** 날짜 태그 */}
        <TagDate size="sm" shape="circle" color="black80" isInverted isDisabled>
          YYYY.MM.DD
        </TagDate>
        {/** 상대 채팅 - 단독 메시지 (수:off 대상:on) */}
        <MessageBubble variant="modal" isMine={false} messages={['안녕하세요!']} time="14:30" />
        {/** 상대 채팅 - 연속 메시지 (수:on 대상:on) */}
        <MessageBubble
        variant="modal"
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
        variant="modal"
          isMine={true}
          messages={['네, 아직 모집 중이에요!']}
          time="14:32"
        />
        {/** 내 채팅 - 연속 메시지 (수:on 대상:off) */}
        <MessageBubble
        variant="modal"
          isMine={true}
          messages={[
            '프론트엔드 포지션인데요.',
            '포트폴리오 있으시면 보내주세요.',
          ]}
          time="14:33"
        />
      </div>
      {/** 메세지 보내는 창 */}
      <div className="flex w-[36rem] p-[1rem] items-start gap-[1rem] bg-black-5 rounded-b-[2rem]" style={{ boxShadow: '0 -2px 10px 0 rgba(0, 0, 0, 0.10)' }}>
        <div className="flex w-full items-center gap-[2rem] self-stretch">
          <div className="flex h-[4.4rem] py-[0.8rem] pl-[2.8rem] pr-[2.4rem] items-center gap-[1rem] flex-1 rounded-[9.9rem] bg-black-10">
            <span className="text-black-50 text-[1.4rem] font-[500] leading-[1.5]"> 메시지 입력... </span>
          </div>
          <IconWrapper> <IcSend /> </IconWrapper>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
