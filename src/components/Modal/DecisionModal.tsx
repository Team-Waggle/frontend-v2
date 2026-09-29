import { useModal } from '../../hooks/useModal';
import type { ModalProps } from '../../types/modal';
import BaseButton from '../common/Button';
import ModalOverlay from './ModalOverlay';
import ModalPortal from './ModalPortal';

interface DescisionModalProps extends ModalProps {
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
}

const DescisionModal = ({
  isOpen,
  onClose,
  handleDone,
  title,
  description,
  confirmText,
  cancelText,
}: DescisionModalProps) => {
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
        <div className="relative w-[44.6rem] rounded-[2rem] bg-black-5 px-[4rem] pt-[4rem]">
          <div className="flex flex-col gap-[4rem]">
            <div className="flex flex-col gap-[1.2rem]">
              <span className="text-[2.4rem] font-bold text-black-100">
                {title}
              </span>
              <span className="text-[1.6rem] font-medium text-black-80">
                {description}
              </span>
            </div>
            <div className="flex gap-[1rem] pb-[3.8rem]">
              <BaseButton
                size="lg"
                color="secondary"
                onClick={onClose}
                className="w-full"
              >
                {cancelText}
              </BaseButton>
              <BaseButton
                size="lg"
                onClick={handleDone}
                className="w-full whitespace-nowrap"
              >
                {confirmText}
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default DescisionModal;
