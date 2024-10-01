import React, { useEffect, useRef, useState } from "react";
import * as St from "./styles/TextEditor.style";
import textStore from "@stores/textStore";
import drawingTypeStore from "@/stores/drawingTypeStore";

const TextEditor = ({
  scale,
  hasDraggedRef,
  isDraggingRef,
  currentPageItems,
}) => {
  const {
    updateTextItem,
    finishEditing,
    updateTextItemPosition,
    addTextItem,
    resetDraggingState,
  } = textStore();

  const { setTextMode, mode } = drawingTypeStore();

  const [curItems, setCurItems] = useState(currentPageItems);
  const [updatedItems, setUpdatedItems] = useState([]); // 갱신할 아이템을 저장할 상태
  const containerRef = useRef();

  const handleAddTextBox = (e) => {
    if (isDraggingRef.current || hasDraggedRef.current) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = (clientX - containerRect.left) / scale;
    const y = (clientY - containerRect.top) / scale;

    addTextItem({
      id: Date.now(),
      x,
      y,
      text: "",
      isEditing: true,
      isDragging: false,
      offsetX: 0,
      offsetY: 0,
      fontSize: 16,
    });
  };

  const handleClickEvent = (e) => {
    if (mode.text) {
      if (!e.target.closest(".text-box")) {
        handleAddTextBox(e);
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;

    if (mode.text) {
      container.addEventListener("mousedown", handleClickEvent);
    }

    return () => {
      container.removeEventListener("mousedown", handleClickEvent);
    };
  }, [mode.text]);

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

      setCurItems((items) => {
        return items.map((item) => {
          if (item.isDragging) {
            setUpdatedItems((prevItems) => [
              ...prevItems,
              { id: item.id, x: item.x, y: item.y },
            ]); // 업데이트 할 아이템을 추가
            return { ...item, isDragging: false };
          }
          return item;
        });
      });

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
    if (updatedItems.length > 0) {
      updatedItems.forEach(({ id, x, y }) => {
        updateTextItemPosition(id, x, y); // zustand에 상태 갱신
      });
      setUpdatedItems([]); // 갱신 후 초기화
    }
  }, [updatedItems]);

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
        onClick={() => setTextMode()}
        style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}
      >
        {mode.text ? "Text Mode On" : "Text Mode Off"}
      </button>
      {curItems.map((item) => (
        <St.TextBox
          key={item.id}
          x={item.x * scale}
          y={item.y * scale}
          isEditing={item.isEditing}
          isDragging={item.isDragging}
          className="text-box"
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
