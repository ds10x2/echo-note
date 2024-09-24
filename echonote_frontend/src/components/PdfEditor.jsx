import React, { useState, useEffect, useRef } from "react";
import * as St from "./styles/PdfEditor.style";

const PdfEditor = ({ canvasSize }) => {
  const containerRef = useRef();
  const [textItems, setTextItems] = useState([]);
  const [isTextMode, setIsTextMode] = useState(false);
  const isDraggingRef = useRef(false); // 드래그 여부만 사용

  // 텍스트 모드가 활성화된 경우 텍스트 박스 추가
  const addTextBox = (e) => {
    if (!isTextMode || isDraggingRef.current) return; // 드래그 중이면 텍스트 박스 추가 방지

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

  // 텍스트 박스 내용 업데이트
  const updateTextItem = (id, newText) => {
    setTextItems((items) =>
      items.map((item) => (item.id === id ? { ...item, text: newText } : item))
    );
  };

  // 텍스트 입력 완료 시 편집 모드 종료 또는 텍스트 박스 제거
  const finishEditing = (id) => {
    setTextItems((items) =>
      items.filter((item) => {
        if (item.id === id) {
          if (item.text.trim() === "") {
            return false; // 텍스트가 비어 있으면 제거
          }
          item.isEditing = false; // 편집 모드 종료
        }
        return true;
      })
    );
  };

  // 드래그 시작
  const handleMouseDown = (e, id) => {
    e.stopPropagation();
    isDraggingRef.current = true; // 드래그 시작 시 true로 설정

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
    }
  };

  // 드래그 종료
  const handleMouseUp = () => {
    isDraggingRef.current = false; // 드래그 종료 시 false로 설정
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
      isDragging={isDraggingRef.current}
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
