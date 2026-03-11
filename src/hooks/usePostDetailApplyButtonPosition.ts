import { type RefObject, useEffect, useState } from 'react';

const usePostDetailApplyButtonPosition = (
  leftColRef: RefObject<HTMLDivElement | null>,
) => {
  const [applyButtonPx, setApplyButtonPx] = useState<number | null>(null);

  useEffect(() => {
    const leftEl = leftColRef.current;

    if (!leftEl) {
      return;
    }

    let rafId: number | null = null;

    const updateApplyButton = () => {
      const targetEl = leftColRef.current;

      if (!targetEl) {
        return;
      }

      const rect = targetEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;

      setApplyButtonPx(centerX);
    };

    const scheduleUpdate = () => {
      if (rafId !== null) {
        return;
      }

      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        updateApplyButton();
      });
    };

    scheduleUpdate();

    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('scroll', scheduleUpdate, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      scheduleUpdate();
    });

    resizeObserver.observe(leftEl);

    const mutationObserver = new MutationObserver(() => {
      scheduleUpdate();
    });

    mutationObserver.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => {
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('scroll', scheduleUpdate);

      resizeObserver.disconnect();
      mutationObserver.disconnect();

      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [leftColRef]);

  return applyButtonPx;
};

export default usePostDetailApplyButtonPosition;
