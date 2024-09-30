import React, { useEffect, useRef } from "react";
import * as St from "./styles/TextEditor.style";
import useTextStore from "@stores/useTextStore";

const TextEditor = ({ scale, hasDraggedRef, isDraggingRef }) => {
  const containerRef = useRef();
  const {
    isTextMode,
    textItems,
    updateTextItem,
    finishEditing,
    setIsTextMode,
    setIsDragging,
    dragTextItem,
    resetDraggingState,
  } = useTextStore();

  const handleMouseDown = (e, id) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    hasDraggedRef.current = false;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const item = textItems.find((item) => item.id === id);
    const offsetX = clientX / scale - item.x;
    const offsetY = clientY / scale - item.y;

    setIsDragging(id, true, offsetX, offsetY);

    // Prevent text selection during drag
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e) => {
    if (isDraggingRef.current) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      textItems.forEach((item) => {
        if (item.isDragging) {
          let newX = clientX / scale - item.offsetX;
          let newY = clientY / scale - item.offsetY;

          const containerRect = containerRef.current.getBoundingClientRect();
          const containerWidth = containerRect.width / scale;
          const containerHeight = containerRect.height / scale;

          const textBoxWidth = 100 / scale;
          const textBoxHeight = item.fontSize * scale;

          if (newX < 0) newX = 0;
          else if (newX + textBoxWidth > containerWidth)
            newX = containerWidth - textBoxWidth;

          if (newY < 0) newY = 0;
          else if (newY + textBoxHeight > containerHeight)
            newY = containerHeight - textBoxHeight;

          dragTextItem(item.id, newX, newY);
        }
      });
      hasDraggedRef.current = true;
    }
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      resetDraggingState();

      if (hasDraggedRef.current) {
        setTimeout(() => {
          hasDraggedRef.current = false;
        }, 50);
      }
    }

    document.body.style.userSelect = "auto";
  };

  const handleKeyDown = (e, id) => {
    if (e.key === "Enter") {
      if (e.ctrlKey) {
        e.preventDefault();
        updateTextItem(
          id,
          textItems.find((item) => item.id === id).text + "\n"
        );
      } else {
        e.preventDefault();
        finishEditing(id);
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("touchmove", handleMouseMove);
    container.addEventListener("touchend", handleMouseUp);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("touchmove", handleMouseMove);
      container.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  // 텍스트 길이에 따른 min-width 계산 함수
  const calculateMinWidth = (text, fontSize) => {
    const lines = text.split("\n");
    const longestLine = lines.reduce(
      (a, b) => (a.length > b.length ? a : b),
      ""
    );
    return fontSize * longestLine.length;
  };

  return (
    <St.TextContainer ref={containerRef}>
      <button
        onClick={() => setIsTextMode(!isTextMode)}
        style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}
      >
        {isTextMode ? "Text Mode On" : "Text Mode Off"}
      </button>
      {textItems.map((item) => (
        <St.TextBox
          key={item.id}
          x={item.x * scale}
          y={item.y * scale}
          isEditing={item.isEditing}
          isDragging={item.isDragging}
          onMouseDown={(e) => handleMouseDown(e, item.id)}
          onTouchStart={(e) => handleMouseDown(e, item.id)}
          style={{
            fontSize: `${item.fontSize * scale}px`,
          }}
          minWidth={calculateMinWidth(item.text, item.fontSize * scale)}
        >
          {item.isEditing ? (
            <St.TextArea
              value={item.text}
              autoFocus
              onChange={(e) => updateTextItem(item.id, e.target.value)}
              onBlur={() => finishEditing(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              style={{ fontSize: `${item.fontSize * scale}px` }}
            />
          ) : (
            <St.TextDetail fontSize={item.fontSize * scale}>
              {item.text}
            </St.TextDetail>
          )}
        </St.TextBox>
      ))}
    </St.TextContainer>
  );
};

export default TextEditor;
