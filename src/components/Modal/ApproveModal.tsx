import { useModal } from '../../hooks/useModal';
import type { ModalProps } from '../../types/modal';
import BaseButton from '../common/Button';
import ModalOverlay from './ModalOverlay';
import ModalPortal from './ModalPortal';

const ApproveModal = ({ isOpen, onClose, handleDone }: ModalProps) => {
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
        <div className="relative h-[24.4rem] w-[44.6rem] rounded-[2rem] bg-black-5 px-[4rem] pt-[4rem]">
          <div className="flex flex-col gap-[4rem]">
            <div className="flex flex-col gap-[1.2rem]">
              <span className="text-[2.4rem] font-bold text-black-100">
                해당 지원자를 승인하시겠습니까?
              </span>
              <span className="text-[1.6rem] font-medium text-black-80">
                승인하면 해당 지원자는 프로젝트에 참여하게 됩니다.
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
                승인 확정
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default ApproveModal;
