import BaseButton from '../common/Button';

// Modal
import { useModal } from '../../hooks/useModal';
import type { ModalProps } from '../../types/modal';
import ModalOverlay from './ModalOverlay';
import ModalPortal from './ModalPortal';

const TeamStatusModal = ({ isOpen, onClose, handleDone }: ModalProps) => {
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
        <div className="relative h-[24.7rem] w-[48.8rem] rounded-[1.492rem] bg-black-5 pt-[6.4rem]">
          <div className="flex flex-col items-center gap-[3.2rem]">
            <span className="text-[2.2rem] font-bold text-black-100">
              정말 팀 활동을 마무리할까요?
            </span>
            <div className="flex gap-[1.2rem]">
              <BaseButton
                size="lg"
                color="secondary"
                className="w-[16.1rem]"
                onClick={onClose}
              >
                취소
              </BaseButton>
              <BaseButton
                size="lg"
                className="w-[16.1rem]"
                onClick={handleDone}
              >
                완료
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default TeamStatusModal;
