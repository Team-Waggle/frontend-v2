import { useLocation } from 'react-router-dom';
import IconWrapper from '../../common/IconWrapper';
import MessageModal from '../MessageModal/MessageModal';
import { useMessageModalStore } from '../../../stores/messageModalStore';
import IcMessage from '../../../assets/icons/normal/ic_message.svg?react';

const FloatingMessageButton = () => {
  const location = useLocation();
  const { isOpen, toggle } = useMessageModalStore();

  if (location.pathname.startsWith('/message')) return null;

  return (
    <div className="fixed bottom-[3.6rem] right-[6rem] z-50 flex flex-col items-end gap-[1rem]">
      {isOpen && <MessageModal />}
      {!isOpen && (
        <IconWrapper shape="circle" onClick={toggle} aria-label="메시지 열기">
          <IcMessage />
        </IconWrapper>
      )}
    </div>
  );
};

export default FloatingMessageButton;
