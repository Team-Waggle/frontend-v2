import MessageListItem from './MessageListItem';
import MessageModal from './MessageModal/MessageModal';
import MessageSearchBox from './MessageSearchBox';

const MessageList = () => {
  return (
    <div className="flex h-[108rem] w-[38rem] flex-shrink-0 flex-col items-start gap-[1.7rem] border-r border-solid border-black-20 bg-black-5 p-[2.2rem]">
      <h1 className="text-[1.6rem] font-[600] leading-[1.5] tracking-[-0.032rem] text-black-100">
        메세지
      </h1>
      <MessageSearchBox />
      {/** 비어 있을 때 */}
      {/* <div className="flex flex-col w-full h-full items-center justify-center self-stretch">
        <span className="text-[1.6rem] font-[500] leading-[1.5] tracking-[-0.032rem] text-black-60">
          대화 중인 메시지가 없습니다.
        </span>
      </div> */}
      {/** 메세지 내역이 있을 때 */}
      <MessageListItem />
    </div>
  );
};

export default MessageList;
