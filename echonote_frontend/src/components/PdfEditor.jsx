import React, { useEffect, useRef } from "react";
import * as St from "./styles/PdfEditor.style";
import TextEditor from "@components/TextEditor";
import textStore from "@stores/textStore";

const PdfEditor = ({ scale }) => {
  const containerRef = useRef();
  const { isTextMode, addTextItem } = textStore();
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);

  // 텍스트 박스 추가
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
    if (isTextMode) {
      handleAddTextBox(e);
    }
  };

  useEffect(() => {
    const container = containerRef.current;

    container.addEventListener("mousedown", handleClickEvent);
    container.addEventListener("mouseup", () => {
      isDraggingRef.current = false;
    });

    return () => {
      container.removeEventListener("mousedown", handleClickEvent);
      container.removeEventListener("mouseup", () => {
        isDraggingRef.current = false;
      });
    };
  }, []);

  return (
    <St.PdfEditorContainer ref={containerRef} onClick={handleClickEvent}>
      <TextEditor
        scale={scale}
        hasDraggedRef={hasDraggedRef}
        isDraggingRef={isDraggingRef}
      />
    </St.PdfEditorContainer>
  );
};

export default PdfEditor;
