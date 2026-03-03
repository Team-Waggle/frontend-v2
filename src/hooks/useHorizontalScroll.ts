import { useCallback, useEffect, useRef, useState } from 'react';

type UseHorizontalScrollParams = {
    itemSelector: string;
    gapPx: number;
    deps?: unknown[];
};

type Direction = 'left' | 'right';

const useHorizontalScroll = ({ itemSelector, gapPx, deps = [] }: UseHorizontalScrollParams) => {
    const trackRef = useRef<HTMLDivElement | null>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateScrollButtons = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;

        const threshold = 1;
        const left = el.scrollLeft;
        const maxLeft = el.scrollWidth - el.clientWidth;

        setCanScrollLeft(left > threshold);
        setCanScrollRight(maxLeft - left > threshold);
    }, []);

    useEffect(() => {
        updateScrollButtons();
    }, [updateScrollButtons, ...deps]);

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;

        const handleScroll = () => {
            updateScrollButtons();
        };

        const handleResize = () => {
            updateScrollButtons();
        };

        el.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);

        updateScrollButtons();

        return () => {
            el.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, [updateScrollButtons]);

    const scrollByItem = useCallback(
        (direction: Direction) => {
            const el = trackRef.current;
            if (!el) return;

            const firstItem = el.querySelector<HTMLElement>(itemSelector);
            const itemWidth = firstItem ? firstItem.offsetWidth : 0;

            const step = itemWidth > 0 ? itemWidth + gapPx : el.clientWidth;

            el.scrollBy({
                left: direction === 'right' ? step : -step,
                behavior: 'smooth',
            });
        },
        [gapPx, itemSelector],
    );

    return {
        trackRef,
        canScrollLeft,
        canScrollRight,
        scrollByItem,
        updateScrollButtons,
    };
};

export default useHorizontalScroll;