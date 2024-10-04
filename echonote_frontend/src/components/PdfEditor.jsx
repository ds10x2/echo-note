// PdfEditor.jsx
import React, { useEffect, useRef, useState } from "react";
import * as St from "@components/styles/PdfEditor.style";
import TextEditor from "@components/TextEditor";
import textStore from "@stores/textStore";
import ShapeEditor from "@components/ShapeEditor";
import shapeStore from "@/stores/shapeStore";
import pageStore from "@/stores/pageStore";
import drawingTypeStore from "@/stores/drawingTypeStore";

const PdfEditor = ({ scale, containerRef }) => {
  const { getCurrentPageItems, setCurrentPageForText } = textStore();
  const { currentPage, setCurrentPage } = pageStore();
  const { mode } = drawingTypeStore();
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);

  //사각형
  const [rectangles, setRectangles] = useState([]); // 그려진 사각형 목록

  useEffect(() => {
    setCurrentPage(currentPage);
    setCurrentPageForText(currentPage);
  }, [currentPage]);

  return (
    <St.PdfEditorContainer>
      <TextEditor
        scale={scale}
        hasDraggedRef={hasDraggedRef}
        isDraggingRef={isDraggingRef}
        currentPageItems={getCurrentPageItems()}
        parentContainerRef={containerRef}
      />
      <ShapeEditor currentPageItems={getCurrentPageItems()} />
    </St.PdfEditorContainer>
  );
};

export default PdfEditor;
