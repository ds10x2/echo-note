import React, { useState, useEffect, useRef } from "react";
import * as St from "./styles/PdfEditor.style";

const PdfEditor = ({ canvasSize, scale }) => {
  const containerRef = useRef();
  const [textItems, setTextItems] = useState([]);
  const [isTextMode, setIsTextMode] = useState(false);
  const isDraggingRef = useRef(false); // 현재 드래그 상태
  const hasDraggedRef = useRef(false); // 드래그 발생 여부(드래그 종료 시 클릭이벤트 방지용)

  const addTextBox = (e) => {
    if (!isTextMode || isDraggingRef.current || hasDraggedRef.current) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = (clientX - containerRect.left) / scale;
    const y = (clientY - containerRect.top) / scale;

    setTextItems([
      ...textItems,
      {
        id: Date.now(),
        x,
        y,
        text: "",
        isEditing: true,
        isDragging: false,
        offsetX: 0,
        offsetY: 0,
        fontSize: 16, // 기본 폰트 크기
      },
    ]);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;

    setTextItems((items) =>
      items.map((item) =>
        item.isDragging ? { ...item, isDragging: false } : item
      )
    );

    if (hasDraggedRef.current) {
      // 드래그가 발생한 경우 약간의 시간차 후에 hasDraggedRef를 false로 설정
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 50); // 50ms 정도의 시간차를 두어 클릭 이벤트를 차단
    }
  };

  const updateTextItem = (id, newText) => {
    setTextItems((items) =>
      items.map((item) => (item.id === id ? { ...item, text: newText } : item))
    );
  };

  const finishEditing = (id) => {
    setTextItems((items) =>
      items.filter((item) => {
        if (item.id === id) {
          if (item.text.trim() === "") {
            return false;
          }
          item.isEditing = false;
        }
        return true;
      })
    );
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

  const handleMouseDown = (e, id) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    hasDraggedRef.current = false;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    setTextItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              isDragging: true,
              offsetX: clientX / scale - item.x,
              offsetY: clientY / scale - item.y,
            }
          : item
      )
    );
  };

  const handleMouseMove = (e) => {
    if (isDraggingRef.current) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width / scale;
      const containerHeight = containerRect.height / scale;

      setTextItems((items) =>
        items.map((item) => {
          if (item.isDragging) {
            let newX = clientX / scale - item.offsetX;
            let newY = clientY / scale - item.offsetY;

            // 박스가 PdfEditor 범위를 넘지 않도록 조정
            const textBoxWidth = 100 / scale;
            const textBoxHeight = item.fontSize * scale;

            // X 축 범위 확인
            if (newX < 0) newX = 0;
            else if (newX + textBoxWidth > containerWidth)
              newX = containerWidth - textBoxWidth;

            // Y 축 범위 확인
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

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("touchmove", handleMouseMove);
    container.addEventListener("touchend", handleMouseUp);
    container.addEventListener("touchstart", addTextBox);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("touchmove", handleMouseMove);
      container.removeEventListener("touchend", handleMouseUp);
      container.removeEventListener("touchstart", addTextBox);
    };
  }, []);

  return (
    <St.PdfEditorContainer
      ref={containerRef}
      onClick={addTextBox}
      width={canvasSize.width}
      height={canvasSize.height}
    >
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
    </St.PdfEditorContainer>
  );
};

export default PdfEditor;
