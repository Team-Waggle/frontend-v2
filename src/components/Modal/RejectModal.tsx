import { useModal } from '../../hooks/useModal';
import type { ModalProps } from '../../types/modal';
import BaseButton from '../common/Button';
import ModalOverlay from './ModalOverlay';
import ModalPortal from './ModalPortal';

const RejectModal = ({ isOpen, onClose, handleDone }: ModalProps) => {
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
        <div className="relative h-[26.8rem] w-[44.6rem] rounded-[2rem] bg-black-5 px-[4rem] pt-[4rem]">
          <div className="flex flex-col gap-[4rem]">
            <div className="flex flex-col gap-[1.2rem]">
              <span className="text-[2.4rem] font-bold text-black-100">
                정말 거절하시겠습니까?
              </span>
              <span className="w-[27.9rem] whitespace-nowrap text-[1.6rem] font-medium text-black-80">
                거절하면 해당 지원자는 대기 목록에서 처리됨으로 이동하며, <br />
                이후 되돌릴 수 없습니다.
              </span>
            </div>
            <div className="flex gap-[1rem] pb-[3.8rem]">
              <BaseButton
                size="lg"
                color="secondary"
                onClick={onClose}
                className="w-full"
              >
                아니요
              </BaseButton>
              <BaseButton
                size="lg"
                onClick={handleDone}
                className="w-full whitespace-nowrap"
              >
                거절 확정
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default RejectModal;
