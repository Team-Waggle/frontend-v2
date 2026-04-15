import { useMessageModalStore } from '../../../stores/messageModalStore';
import ModalChatView from './ModalChatView';
import ModalListView from './ModalListView';

const MessageModal = () => {
  const { partnerId } = useMessageModalStore();

  return (
    <div className="flex h-[51.6rem] w-[36rem] flex-col items-start rounded-[2rem] bg-black-5 shadow-[0_0_20px_0_rgba(0,0,0,0.20)] backdrop-blur-[32px]">
      {partnerId ? <ModalChatView partnerId={partnerId} /> : <ModalListView />}
    </div>
  );
};

export default MessageModal;
