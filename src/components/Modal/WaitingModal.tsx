import { useModal } from '../../hooks/useModal';
import type { ModalProps } from '../../types/modal';
import ModalOverlay from './ModalOverlay';
import ModalPortal from './ModalPortal';

import WaitingIcon from '../../assets/icons/ic_waiting.svg?react';

const WaitingModal = ({ isOpen, onClose }: ModalProps) => {
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
        <div className="relative h-[65rem] w-[73.8rem] rounded-[2rem] bg-black-5">
          <WaitingIcon />
        </div>
      </div>
    </ModalPortal>
  );
};

export default WaitingModal;
