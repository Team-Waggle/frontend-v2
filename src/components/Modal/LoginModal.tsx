import { BASE_URL } from '../../constants/endpoint';
import ModalOverlay from './ModalOverlay';
import ModalPortal from './ModalPortal';
import { useModal } from '../../hooks/useModal';
import type { ModalProps } from '../../types/modal';

// Icons
import CloseIcon from '../../assets/icons/normal/ic_close.svg?react';
import CharacterIcon from '../../assets/icons/ic_character.svg?react';
import GoogleBtn from '../../assets/icons/ic_google.svg?react';
import KakaoBtn from '../../assets/icons/ic_kakao.svg?react';

const LoginModal = ({ isOpen, onClose }: ModalProps) => {
  useModal({ isOpen, onClose });
  if (!isOpen) return null;

  const handleLoginClick = (provider: 'google' | 'kakao') => {
    const currentPath = window.location.pathname + window.location.search;
    sessionStorage.setItem('returnUrl', currentPath);
    sessionStorage.setItem('loginProvider', provider);
    window.location.href = `${BASE_URL}/oauth2/authorization/${provider}`;
  };

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
      >
        <ModalOverlay onClose={onClose} />
        <div className="relative flex h-[38.3rem] w-[31.2rem] justify-center rounded-[0.8rem] bg-black-5">
          <button className="absolute right-[1.6rem] top-[1.6rem] h-[2.4rem] w-[2.4rem]">
            <CloseIcon className="text-black-60" onClick={onClose} />
          </button>

          <div className="mt-[1.6rem] flex flex-col items-center">
            {/* 모달 내용 */}
            <CharacterIcon />
            <div className="mt-[1.9rem]">
              <span className="text-[1.8rem] font-semibold">
                Waggle에 오신 것을 환영합니다!
              </span>
            </div>
            {/* 버튼 */}
            <div className="mt-[7.8rem] grid gap-[0.8rem]">
              <GoogleBtn
                onClick={() => handleLoginClick('google')}
                className="cursor-pointer"
              />
              <KakaoBtn
                onClick={() => handleLoginClick('kakao')}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default LoginModal;
