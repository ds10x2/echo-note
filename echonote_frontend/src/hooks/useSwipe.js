// hooks/useSwipe.js
import { useEffect, useRef } from "react";

export const useSwipe = (
  isPinching,
  containerRef,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown
) => {
  const startX = useRef(0);
  const startY = useRef(0);
  const isSwiping = useRef(false);

  useEffect(() => {
    const handleTouchStart = (e) => {
      if (isPinching.current || e.touches.length > 1) return; // 핀치 줌 중이거나 멀티 터치 시 스와이프 무시
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
      isSwiping.current = true;
    };

    const handleTouchEnd = (e) => {
      if (!isSwiping.current || isPinching.current) return;

      const container = containerRef.current;
      if (container) {
        // 현재 스크롤 위치 확인
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;

        const scrollLeft = container.scrollLeft;
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;

        // 스크롤이 맨 위나 맨 아래 또는 맨 왼쪽이나 맨 오른쪽이 아니라면 스와이프 동작 무시
        const isVerticalScrollAllowed =
          scrollTop > 0 && scrollTop + clientHeight < scrollHeight;
        const isHorizontalScrollAllowed =
          scrollLeft > 0 && scrollLeft + clientWidth < scrollWidth;

        if (isVerticalScrollAllowed || isHorizontalScrollAllowed) {
          isSwiping.current = false;
          return;
        }
      }

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;

      const diffX = endX - startX.current;
      const diffY = endY - startY.current;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 30) {
          onSwipeRight && onSwipeRight(); // 오른쪽으로 스와이프
        } else if (diffX < -30) {
          onSwipeLeft && onSwipeLeft(); // 왼쪽으로 스와이프
        }
      } else {
        if (diffY > 30) {
          onSwipeDown && onSwipeDown(); // 아래로 스와이프
        } else if (diffY < -30) {
          onSwipeUp && onSwipeUp(); // 위로 스와이프
        }
      }
      isSwiping.current = false; // 스와이프 동작 완료 후 상태 초기화
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    isPinching,
    containerRef,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
  ]);
};
