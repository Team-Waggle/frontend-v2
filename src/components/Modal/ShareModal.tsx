import { useEffect } from 'react';
import { toast } from 'sonner';

import { useModal } from '../../hooks/useModal';
import { loadKakaoSdk, shareToKakao } from '../../lib/kakao';
import IconWrapper from '../common/IconWrapper';
import ModalOverlay from './ModalOverlay';
import ModalPortal from './ModalPortal';

import IcThreads from '../../assets/icons/color/ic_logoThreads_color.svg?react';
import IcX from '../../assets/icons/color/ic_logoX_color.svg?react';
import IcKakao from '../../assets/icons/color/ic_logoKakao_color.svg?react';
import IcFacebook from '../../assets/icons/color/ic_logoFacebook_color.svg?react';
import IcLink from '../../assets/icons/normal/ic_link.svg?react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url?: string;
  title?: string;
}

const openShareWindow = (shareUrl: string) => {
  window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=600');
};

const ShareModal = ({ isOpen, onClose, url, title = '' }: ShareModalProps) => {
  useModal({ isOpen, onClose });

  useEffect(() => {
    if (isOpen) loadKakaoSdk();
  }, [isOpen]);

  if (!isOpen) return null;

  const shareUrl = url ?? window.location.href;

  const copyLink = async (successMessage = '주소가 복사되었습니다.') => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success(successMessage);
    } catch (error) {
      console.error(error);
      toast.error('주소 복사 중 오류가 발생했습니다.');
    }
  };

  // SDK를 불러오지 못한 경우(앱 키 누락, 네트워크 오류 등)에는 에러 안내 후 다음 클릭을 위해 다시 불러옴
  const shareKakao = () => {
    if (shareToKakao({ url: shareUrl, title: title || 'Waggle' })) return;
    // 기획 확인 전까지 링크 복사 대체 동작은 막아둠
    // copyLink('주소가 복사되었습니다. 카카오톡에 붙여넣어 공유해 주세요.');
    toast.error(
      '카카오톡 공유를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.',
    );
    loadKakaoSdk();
  };

  const shareItems = [
    {
      label: '스레드',
      Icon: IcThreads,
      onClick: () =>
        openShareWindow(
          `https://www.threads.net/intent/post?text=${encodeURIComponent(`${title} ${shareUrl}`.trim())}`,
        ),
    },
    {
      label: 'X',
      Icon: IcX,
      onClick: () =>
        openShareWindow(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
        ),
    },
    {
      label: '카카오톡',
      Icon: IcKakao,
      onClick: shareKakao,
    },
    {
      label: '페이스북',
      Icon: IcFacebook,
      onClick: () =>
        openShareWindow(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        ),
    },
    {
      label: '링크복사',
      Icon: IcLink,
      onClick: () => copyLink(),
    },
  ];

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
      >
        <ModalOverlay onClose={onClose} />
        <div className="relative w-[44.6rem] rounded-[2rem] bg-black-5 p-[4rem] max-495:w-[30rem]">
          <div className="flex flex-col gap-[3.2rem] pb-[4rem]">
            <span
              id="share-modal-title"
              className="text-[2.4rem] font-bold leading-[1.5] tracking-[-0.048rem] text-black-100"
            >
              공유하기
            </span>
            <ul className="grid grid-cols-5 gap-[1.6rem] max-495:grid-cols-3">
              {shareItems.map(({ label, Icon, onClick }) => (
                <li
                  key={label}
                  className="flex flex-col items-center justify-center gap-[0.8rem]"
                >
                  <IconWrapper
                    color="outline"
                    shape="circle"
                    className="!h-[4.8rem] !w-[4.8rem]"
                    aria-label={label}
                    onClick={onClick}
                  >
                    <Icon className="h-[2.6rem] w-[2.6rem] text-black-100" />
                  </IconWrapper>
                  <span
                    aria-hidden="true"
                    className="whitespace-nowrap text-[1.5rem] font-[400] leading-[1.5] tracking-[-0.03rem] text-black-80"
                  >
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default ShareModal;
