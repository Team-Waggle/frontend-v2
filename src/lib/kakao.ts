const KAKAO_SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.8.3/kakao.min.js';
const KAKAO_SDK_INTEGRITY =
  'sha384-oroumrnFVE0xtgqyDZJARgERibXg2C28380uaUZz2kHDS5CR7tu20eGiOU6GkTpy';

const DEFAULT_SHARE_IMAGE = 'https://waggle.lol/og_image.png';
const DEFAULT_SHARE_DESCRIPTION = '여기를 눌러 링크를 확인하세요.';

interface KakaoLink {
  webUrl: string;
  mobileWebUrl: string;
}

interface KakaoSdk {
  init: (appKey: string) => void;
  isInitialized: () => boolean;
  Share: {
    sendDefault: (settings: {
      objectType: 'feed';
      content: {
        title: string;
        description?: string;
        imageUrl: string;
        link: KakaoLink;
      };
      buttons?: Array<{ title: string; link: KakaoLink }>;
    }) => void;
  };
}

declare global {
  interface Window {
    Kakao?: KakaoSdk;
  }
}

let sdkPromise: Promise<boolean> | null = null;

const initKakao = () => {
  const appKey = import.meta.env.VITE_KAKAO_JS_KEY;
  if (!appKey || !window.Kakao) return false;

  if (!window.Kakao.isInitialized()) window.Kakao.init(appKey);
  return true;
};

// SDK는 공유 모달을 열 때 미리 불러온다. 클릭 후에 불러오면 팝업이 차단될 수 있음
export const loadKakaoSdk = () => {
  if (!import.meta.env.VITE_KAKAO_JS_KEY) return Promise.resolve(false);
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<boolean>((resolve) => {
    if (window.Kakao) {
      resolve(initKakao());
      return;
    }

    const script = document.createElement('script');
    script.src = KAKAO_SDK_URL;
    script.integrity = KAKAO_SDK_INTEGRITY;
    script.crossOrigin = 'anonymous';
    script.async = true;
    script.onload = () => resolve(initKakao());
    script.onerror = () => {
      sdkPromise = null;
      script.remove();
      resolve(false);
    };
    document.head.appendChild(script);
  });

  return sdkPromise;
};

interface KakaoShareParams {
  url: string;
  title: string;
  description?: string;
  imageUrl?: string;
}

/** 카카오톡 공유 창을 연다. SDK가 준비되지 않았으면 false를 반환 */
export const shareToKakao = ({
  url,
  title,
  description = DEFAULT_SHARE_DESCRIPTION,
  imageUrl = DEFAULT_SHARE_IMAGE,
}: KakaoShareParams) => {
  if (!window.Kakao?.isInitialized()) return false;

  const link = { webUrl: url, mobileWebUrl: url };

  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: { title, description, imageUrl, link },
    buttons: [{ title: '자세히 보기', link }],
  });
  return true;
};
