import BaseButton from '../common/Button';
import { useModal } from '../../hooks/useModal';
import type { ModalProps } from '../../types/modal';
import ModalOverlay from './ModalOverlay';
import ModalPortal from './ModalPortal';

const TeamDeleteModal = ({ isOpen, onClose, handleDone }: ModalProps) => {
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
        <div className="relative flex h-[30.9rem] w-[48.8rem] justify-center rounded-[1.492rem] bg-black-5 py-[6.4rem]">
          <div className="flex w-[33.4rem] flex-col gap-[3.2rem]">
            <div className="flex w-[31.4rem] flex-col items-center gap-[0.8rem]">
              <span className="text-[2.2rem] font-bold text-black-100">
                정말 팀을 삭제할까요?
              </span>
              <span className="whitespace-nowrap text-center text-[1.8rem] font-medium text-black-80">
                팀을 삭제하면 팀 정보, 모집글/지원자 정보, <br />
                팀내 데이터가 모두 삭제되며 복구할수 없어요.
              </span>
            </div>
            <div className="flex gap-[1.2rem]">
              <BaseButton
                size="lg"
                color="secondary"
                onClick={onClose}
                className="w-[16.1rem]"
              >
                취소
              </BaseButton>
              <BaseButton
                size="lg"
                onClick={handleDone}
                className="w-[16.1rem]"
              >
                삭제
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default TeamDeleteModal;
