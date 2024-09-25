import React, { useState, useEffect, useRef } from "react";
import * as St from "./styles/PdfEditor.style";

const PdfEditor = ({ canvasSize }) => {
  const containerRef = useRef();
  const [textItems, setTextItems] = useState([]);
  const [isTextMode, setIsTextMode] = useState(false);
  const isDraggingRef = useRef(false); // 현재 드래그 상태
  const hasDraggedRef = useRef(false); // 드래그 발생 여부(드래그 종료 시 클릭이벤트 방지용)

  const addTextBox = (e) => {
    if (!isTextMode || isDraggingRef.current || hasDraggedRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;

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
      },
    ]);
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

  // 드래그 시작
  const handleMouseDown = (e, id) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    hasDraggedRef.current = false;

    setTextItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              isDragging: true,
              offsetX: e.clientX - item.x,
              offsetY: e.clientY - item.y,
            }
          : item
      )
    );
  };

  // 드래그 중
  const handleMouseMove = (e) => {
    if (isDraggingRef.current) {
      setTextItems((items) =>
        items.map((item) =>
          item.isDragging
            ? {
                ...item,
                x: e.clientX - item.offsetX,
                y: e.clientY - item.offsetY,
              }
            : item
        )
      );
      hasDraggedRef.current = true; // 실제로 드래그 동작이 발생했음을 기록
    }
  };

  // 드래그 종료
  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setTextItems((items) =>
      items.map((item) =>
        item.isDragging ? { ...item, isDragging: false } : item
      )
    );
  };

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseup", handleMouseUp);
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseup", handleMouseUp);
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
          x={item.x}
          y={item.y}
          isEditing={item.isEditing}
          isDragging={item.isDragging}
          onMouseDown={(e) => handleMouseDown(e, item.id)}
        >
          {item.isEditing ? (
            <St.TextArea
              value={item.text}
              autoFocus
              onChange={(e) => updateTextItem(item.id, e.target.value)}
              onBlur={() => finishEditing(item.id)}
            />
          ) : (
            <div>{item.text}</div>
          )}
        </St.TextBox>
      ))}
    </St.PdfEditorContainer>
  );
};

export default PdfEditor;
