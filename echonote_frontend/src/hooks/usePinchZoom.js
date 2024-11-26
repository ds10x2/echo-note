import { useEffect, useRef } from "react";

export const usePinchZoom = (containerRef, setScale) => {
  const isPinching = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let initialDistance = null;

    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        isPinching.current = true;
        const dx = e.touches[0].pageX - e.touches[1].pageX;
        const dy = e.touches[0].pageY - e.touches[1].pageY;
        initialDistance = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length === 2 && initialDistance) {
        e.preventDefault();
        const dx = e.touches[0].pageX - e.touches[1].pageX;
        const dy = e.touches[0].pageY - e.touches[1].pageY;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);

        if (currentDistance > initialDistance) {
          setScale((prevScale) => Math.min(prevScale + 0.02, 5)); // Zoom In
        } else {
          setScale((prevScale) => Math.max(prevScale - 0.02, 0.7)); // Zoom Out
        }

        initialDistance = currentDistance;
        e.preventDefault();
      }
    };

    const onTouchEnd = () => {
      initialDistance = null;
      isPinching.current = false;
    };

    container.addEventListener("touchstart", onTouchStart, { passive: false });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd);

    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [containerRef, setScale]);

  return isPinching;
};
