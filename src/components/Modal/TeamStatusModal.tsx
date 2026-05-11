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
        <div className="relative h-[30.9rem] w-[48.8rem] rounded-[1.492rem] bg-black-5 py-[6.4rem]">
          <div className="flex flex-col items-center gap-[3.2rem]">
            <div className="flex flex-col items-center gap-[0.8rem]">
              <span className="text-[2.2rem] font-bold text-black-100">
                정말 팀 활동을 완료할까요?
              </span>
              <span className="whitespace-pre-line text-[1.8rem] font-medium text-black-80">
                {`'완료' 후에는 팀원 모집과 공고가 마감되며, \n이전 상태로 되돌릴 수 없습니다.`}
              </span>
            </div>
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
