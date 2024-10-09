// PdfEditor.jsx
import React, { useEffect, useRef, useState } from "react";
import * as St from "@components/styles/PdfEditor.style";
import TextEditor from "@components/TextEditor";
import textStore from "@stores/textStore";
import ShapeEditor from "@components/ShapeEditor";
import shapeStore from "@/stores/shapeStore";
import pageStore from "@/stores/pageStore";
import drawingTypeStore from "@/stores/drawingTypeStore";

const PdfEditor = ({ scale, containerRef, originalSize }) => {
  const { getCurrentPageItems, setCurrentPageForText } = textStore();
  const { getRectangles, getCircles, setCurrentPageForShape } = shapeStore();
  const { currentPage, setCurrentPage } = pageStore();
  const { mode } = drawingTypeStore();
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);

  useEffect(() => {
    if (pageStore.getState().currentPage !== currentPage) {
      setCurrentPage(currentPage);
    }
    setCurrentPageForText(currentPage);
    setCurrentPageForShape(currentPage);
  }, [currentPage]);

  return (
    <St.PdfEditorContainer
      originalSize={originalSize}
      scale={scale}
      mode={mode.pen}
    >
      <TextEditor
        scale={scale}
        hasDraggedRef={hasDraggedRef}
        isDraggingRef={isDraggingRef}
        currentPageItems={getCurrentPageItems()}
        parentContainerRef={containerRef}
      />
      <ShapeEditor
        currentPageRecs={getRectangles()}
        currentPageCircles={getCircles()}
        scale={scale}
        parentContainerRef={containerRef}
      />
    </St.PdfEditorContainer>
  );
};

export default PdfEditor;
