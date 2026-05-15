import { Component, type ReactNode } from 'react';
import { persister } from '../lib/persister';

const CACHE_KEY = 'REACT_QUERY_OFFLINE_CACHE';
const RECOVERY_FLAG = 'cache_recovery_at';
const RECOVERY_COOLDOWN_MS = 60_000;

type Props = { children: ReactNode };
type State = { hasError: boolean };

// destructive 스키마 변경 등으로 캐시-코드 불일치가 발생해 렌더 중 throw하면,
// localStorage의 React Query 캐시를 비우고 한 번 reload하여 자동 복구한다.
// 1분 이내 재발생은 무한 reload 루프로 간주해 fallback UI로 정착시킨다.
export class CacheErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch() {
    const lastRecoveryAt = Number(sessionStorage.getItem(RECOVERY_FLAG)) || 0;
    if (Date.now() - lastRecoveryAt < RECOVERY_COOLDOWN_MS) return;

    sessionStorage.setItem(RECOVERY_FLAG, String(Date.now()));

    // persister 내부 throttle queue까지 비워 race로 옛 캐시가 다시 들어가는
    // 윈도우를 차단한다. 안전망으로 직접 removeItem도 한 번 더 호출.
    // removeClient() 반환 타입이 Promisable<void>라 Promise.resolve로 래핑.
    Promise.resolve(persister.removeClient())
      .catch(() => {})
      .then(() => {
        localStorage.removeItem(CACHE_KEY);
        window.location.reload();
      });
  }

  handleRetry = () => {
    sessionStorage.removeItem(RECOVERY_FLAG);
    localStorage.removeItem(CACHE_KEY);
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-[1.6rem]">
          <p className="text-[1.6rem] font-medium text-black-100">
            일시적인 오류가 발생했습니다.
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="rounded-[0.8rem] bg-blue-60 px-[2.4rem] py-[1.2rem] text-[1.4rem] font-semibold text-black-5 hover:bg-hover-80"
          >
            다시 시도
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
