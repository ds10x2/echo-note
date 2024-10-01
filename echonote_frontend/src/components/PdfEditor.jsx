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

  return (
    <St.PdfEditorContainer ref={containerRef}>
      <TextEditor
        containerRef={containerRef}
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
