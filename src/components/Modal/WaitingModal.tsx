import { useNavigate } from 'react-router';
import type { UserMeResponse } from '../../types/api/user';
import BaseButton from '../common/Button';

// Modals
import { useModal } from '../../hooks/useModal';
import type { ModalProps } from '../../types/modal';
import ModalOverlay from './ModalOverlay';
import ModalPortal from './ModalPortal';

// Icons
import CloseIcon from '../../assets/icons/normal/ic_close.svg?react';
import WaitingIcon from '../../assets/icons/ic_character_waiting.svg?react';
import Confetti1Icon from '../../assets/icons/ic_confetti1.svg?react';
import Confetti2Icon from '../../assets/icons/ic_confetti2.svg?react';
import Confetti3Icon from '../../assets/icons/ic_confetti3.svg?react';

interface WaitingModalProps extends ModalProps {
  myData?: UserMeResponse;
}

const WaitingModal = ({ isOpen, onClose, myData }: WaitingModalProps) => {
  const navigate = useNavigate();
  useModal({ isOpen, onClose });
  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
      >
        <ModalOverlay onClose={onClose} />
        <div className="relative h-[65rem] w-[73.8rem] rounded-[2rem] bg-black-5 pb-[11.5rem] pl-[20.1rem] pr-[20rem] pt-[15.8rem]">
          <CloseIcon
            onClick={onClose}
            className="absolute right-[3.2rem] top-[3.2rem] cursor-pointer"
          />
          <Confetti1Icon className="absolute left-[6.329rem] top-0" />
          <div className="flex h-[37.7rem] w-[33.7rem] flex-col items-center gap-[4.5rem]">
            <div className="flex flex-col items-center gap-[2.6rem]">
              <WaitingIcon />
              <div className="flex flex-col gap-[1rem]">
                <span className="text-[3rem] font-bold text-black-100">
                  지원 신청이 완료되었습니다!
                </span>
                <span className="text-center text-[2rem] font-medium text-black-90">
                  팀장 및 관리자의 승인을 기다리고 있습니다. 승인 결과는
                  알림으로 안내해 드립니다.
                </span>
              </div>
            </div>
            <BaseButton
              size="xl"
              color="secondary"
              onClick={() => navigate(`/profile/${myData?.id}/applications`)}
              className="w-[25rem]"
            >
              지원 목록 이동
            </BaseButton>
          </div>
          <Confetti2Icon className="absolute bottom-[2.331rem] left-[-0.269rem]" />
          <Confetti3Icon className="absolute bottom-0 right-0" />
        </div>
      </div>
    </ModalPortal>
  );
};

export default WaitingModal;
