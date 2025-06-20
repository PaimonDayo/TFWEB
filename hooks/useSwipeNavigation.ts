import { useEffect, useRef } from 'react';

interface SwipeNavigationProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  threshold?: number;
  enabled?: boolean;
}

export const useSwipeNavigation = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  enabled = true
}: SwipeNavigationProps) => {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartX.current || !touchStartY.current) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      
      const diffX = touchStartX.current - currentX;
      const diffY = touchStartY.current - currentY;

      // Only process horizontal swipes (not vertical scrolling)
      if (Math.abs(diffY) > Math.abs(diffX)) {
        return;
      }

      // Prevent default scrolling for horizontal swipes
      if (Math.abs(diffX) > 10) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartX.current || !touchStartY.current) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const diffX = touchStartX.current - endX;
      const diffY = touchStartY.current - endY;

      // Only process horizontal swipes
      if (Math.abs(diffY) > Math.abs(diffX)) {
        touchStartX.current = null;
        touchStartY.current = null;
        return;
      }

      // Check if swipe meets threshold
      if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          // Swiped left (next)
          onSwipeLeft();
        } else {
          // Swiped right (previous)
          onSwipeRight();
        }
      }

      touchStartX.current = null;
      touchStartY.current = null;
    };

    const element = elementRef.current || document.body;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, threshold, enabled]);

  return { elementRef };
};