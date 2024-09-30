// PdfEditor.jsx
import React, { useEffect, useRef, useState } from "react";
import * as St from "@components/styles/PdfEditor.style";
import TextEditor from "@components/TextEditor";
import textStore from "@stores/textStore";
import ShapeEditor from "@components/ShapeEditor";
import shapeStore from "@/stores/shapeStore";

const PdfEditor = ({ scale, currentPage }) => {
  const containerRef = useRef();
  const { isTextMode, addTextItem, getCurrentPageItems, setCurrentPage } =
    textStore();
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);

  const { isShapeMode } = shapeStore();

  //사각형
  const [rectangles, setRectangles] = useState([]); // 그려진 사각형 목록

  useEffect(() => {
    setCurrentPage(currentPage);
  }, [currentPage]);

  const handleAddTextBox = (e) => {
    if (isDraggingRef.current || hasDraggedRef.current) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = (clientX - containerRect.left) / scale;
    const y = (clientY - containerRect.top) / scale;

    console.log("텍스트 추가");
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
    if (isTextMode) {
      handleAddTextBox(e);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    const container = containerRef.current;

    // isTextMode가 true일 때만 이벤트 리스너를 추가
    if (isTextMode) {
      container.addEventListener("mousedown", handleClickEvent);
      container.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      container.removeEventListener("mousedown", handleClickEvent);
      container.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isTextMode]);

  return (
    <St.PdfEditorContainer ref={containerRef}>
      <TextEditor
        scale={scale}
        hasDraggedRef={hasDraggedRef}
        isDraggingRef={isDraggingRef}
        currentPageItems={getCurrentPageItems()}
      />
      <ShapeEditor
        scale={scale}
        hasDraggedRef={hasDraggedRef}
        isDraggingRef={isDraggingRef}
        currentPageItems={getCurrentPageItems()}
        rectangles={rectangles}
        setRectangles={setRectangles}
      />
    </St.PdfEditorContainer>
  );
};

export default PdfEditor;
