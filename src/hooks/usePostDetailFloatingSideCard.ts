import { type RefObject, useEffect } from 'react';

const usePostDetailFloatingSideCard = (
  leftColRef: RefObject<HTMLDivElement | null>,
  sideWrapRef: RefObject<HTMLDivElement | null>,
  topOffsetPx: number = 112,
) => {
  useEffect(() => {
    const leftEl = leftColRef.current;
    const sideEl = sideWrapRef.current;

    if (!leftEl || !sideEl) {
      return;
    }

    let currentY = 0;
    let targetY = 0;
    let rafId: number | null = null;

    const clamp = (value: number, min: number, max: number) => {
      if (value < min) {
        return min;
      }

      if (value > max) {
        return max;
      }

      return value;
    };

    const calcTarget = () => {
      const currentLeftEl = leftColRef.current;
      const currentSideEl = sideWrapRef.current;

      if (!currentLeftEl || !currentSideEl) {
        return;
      }

      const scrollY = window.scrollY || window.pageYOffset;

      const leftRect = currentLeftEl.getBoundingClientRect();
      const leftTop = leftRect.top + scrollY;
      const leftHeight = currentLeftEl.offsetHeight;
      const sideHeight = currentSideEl.offsetHeight;

      const maxY = Math.max(0, leftHeight - sideHeight);
      const raw = scrollY + topOffsetPx - leftTop;

      targetY = clamp(raw, 0, maxY);
    };

    const tick = () => {
      const currentSideEl = sideWrapRef.current;

      if (!currentSideEl) {
        return;
      }

      const diff = targetY - currentY;

      if (Math.abs(diff) < 0.1) {
        currentY = targetY;
      } else {
        currentY += diff * 0.12;
      }

      currentSideEl.style.transform = `translate3d(0, ${currentY}px, 0)`;

      rafId = window.requestAnimationFrame(tick);
    };

    const onScroll = () => {
      calcTarget();
    };

    const onResize = () => {
      calcTarget();
    };

    calcTarget();
    rafId = window.requestAnimationFrame(tick);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);

      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [leftColRef, sideWrapRef, topOffsetPx]);
};

export default usePostDetailFloatingSideCard;
