import { useRef } from "react";

export const TextDragging = (setTextItems) => {
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);

  const handleMouseDown = (e, id) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    hasDraggedRef.current = false;

    const clientX = e.clientX;
    const clientY = e.clientY;

    setTextItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              isDragging: true,
              offsetX: clientX - item.x,
              offsetY: clientY - item.y,
            }
          : item
      )
    );
  };

  const handleTouchStart = (e, id) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    hasDraggedRef.current = false;

    const clientX = e.touches[0].clientX;
    const clientY = e.touches[0].clientY;

    setTextItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              isDragging: true,
              offsetX: clientX - item.x,
              offsetY: clientY - item.y,
            }
          : item
      )
    );
  };

  const handleMouseMove = (e, containerRef) => {
    if (isDraggingRef.current) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;

      setTextItems((items) =>
        items.map((item) => {
          if (item.isDragging) {
            let newX = clientX - item.offsetX;
            let newY = clientY - item.offsetY;

            const textBoxWidth = 100;
            const textBoxHeight = item.fontSize;

            if (newX < 0) newX = 0;
            else if (newX + textBoxWidth > containerWidth)
              newX = containerWidth - textBoxWidth;

            if (newY < 0) newY = 0;
            else if (newY + textBoxHeight > containerHeight)
              newY = containerHeight - textBoxHeight;

            return {
              ...item,
              x: newX,
              y: newY,
            };
          }
          return item;
        })
      );
      hasDraggedRef.current = true;
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;

    setTextItems((items) =>
      items.map((item) =>
        item.isDragging ? { ...item, isDragging: false } : item
      )
    );

    if (hasDraggedRef.current) {
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 50);
    }
  };

  return {
    handleMouseDown,
    handleTouchStart,
    handleMouseMove,
    handleMouseUp,
  };
};
