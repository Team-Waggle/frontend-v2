import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import IconWrapper from '../../common/IconWrapper';
import MessageModal from '../MessageModal/MessageModal';
import LoginModal from '../../Modal/LoginModal';
import { useMessageModalStore } from '../../../stores/messageModalStore';
import { useAuthStore } from '../../../stores/authStore';
import IcMessage from '../../../assets/icons/normal/ic_message.svg?react';

const FloatingMessageButton = () => {
  const location = useLocation();
  const { isOpen, toggle } = useMessageModalStore();
  const { isLoggedIn } = useAuthStore();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  if (location.pathname.startsWith('/message')) return null;

  const handleClick = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    toggle();
  };

  return (
    <>
      <div className="fixed bottom-[3.6rem] right-[6rem] z-50 flex flex-col items-end gap-[1rem]">
        {isOpen && <MessageModal />}
        {!isOpen && (
          <IconWrapper shape="circle" onClick={handleClick} aria-label="메시지 열기" className="shadow-message-btn">
            <IcMessage />
          </IconWrapper>
        )}
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
};

export default FloatingMessageButton;
