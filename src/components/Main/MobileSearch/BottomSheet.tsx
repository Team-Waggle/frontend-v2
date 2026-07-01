import { useEffect } from 'react';
import type { ReactNode } from 'react';

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

const BottomSheet = ({ isOpen, onClose, children }: BottomSheetProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-[100] transition-all duration-300 ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* 오버레이 */}
      <div
        className={`absolute inset-0 bg-black-100 transition-opacity duration-300 ${
          isOpen ? 'opacity-40' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* 패널 */}
      <div
        className={`absolute bottom-0 left-0 right-0 flex flex-col rounded-t-[2.4em] pt-[2rem] pb-[2rem] px-[2rem] gap-[2.8rem] bg-white transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default BottomSheet;
