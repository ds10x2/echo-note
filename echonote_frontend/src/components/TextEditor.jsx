import React, { useEffect, useRef, useState } from "react";
import * as St from "./styles/TextEditor.style";
import textStore from "@stores/textStore";

const TextEditor = ({
  scale,
  hasDraggedRef,
  isDraggingRef,
  currentPageItems,
}) => {
  const containerRef = useRef();
  const {
    isTextMode,
    updateTextItem,
    finishEditing,
    setIsTextMode,
    updateTextItemPosition,
    resetDraggingState,
  } = textStore();

  const [curItems, setCurItems] = useState(currentPageItems);

  useEffect(() => {
    setCurItems(currentPageItems);
  }, [currentPageItems]);

  const handleMouseDown = (e, id) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    hasDraggedRef.current = false;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const item = curItems.find((item) => item.id === id);
    const offsetX = clientX / scale - item.x;
    const offsetY = clientY / scale - item.y;

    console.log("드래그 시작");

    setCurItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              isDragging: true,
              offsetX: offsetX,
              offsetY: offsetY,
            }
          : item
      )
    );

    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e) => {
    if (isDraggingRef.current) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      console.log("드래그 중2");

      setCurItems((items) =>
        items.map((item) => {
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
    if (isDraggingRef.current) {
      isDraggingRef.current = false;

      setCurItems((items) =>
        items.map((item) =>
          item.isDragging ? { ...item, isDragging: false } : item
        )
      );

      resetDraggingState();

      if (hasDraggedRef.current) {
        setTimeout(() => {
          hasDraggedRef.current = false;
        }, 50);
      }
    }

    document.body.style.userSelect = "auto";
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

  const handleKeyDown = (e, id) => {
    if (e.key === "Enter") {
      if (e.ctrlKey) {
        e.preventDefault();
        updateTextItem(id, curItems.find((item) => item.id === id).text + "\n");
      } else {
        e.preventDefault();
        finishEditing(id);
      }
    }
  };

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
      {curItems.map((item) => (
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
