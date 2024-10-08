// PdfEditor.jsx
import React, { useEffect, useRef, useState } from "react";
import * as St from "@components/styles/PdfEditor.style";
import TextEditor from "@components/TextEditor";
import textStore from "@stores/textStore";
import ShapeEditor from "@components/ShapeEditor";
import shapeStore from "@/stores/shapeStore";
import pageStore from "@/stores/pageStore";
import drawingTypeStore from "@/stores/drawingTypeStore";
import canvasStore from "@stores/canvasStore";
import DrawingEditor from "@components/DrawingEditor";
import { DrawingEditorContainer } from "@components/styles/DrawingEditor.style";

const PdfEditor = ({
  scale,
  containerRef,
  originalSize,
  isDrawingEditorOpened,
}) => {
  const { getCurrentPageItems, setCurrentPageForText } = textStore();
  const { getRectangles, getCircles, setCurrentPageForShape } = shapeStore();
  const { currentPage, setCurrentPage } = pageStore();
  const { mode } = drawingTypeStore();
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);

  const { getCanvasImage } = canvasStore.getState();
  const savedImage = getCanvasImage(currentPage);

  useEffect(() => {
    if (pageStore.getState().currentPage !== currentPage) {
      setCurrentPage(currentPage);
    }
    setCurrentPageForText(currentPage);
    setCurrentPageForShape(currentPage);
  }, [currentPage]);

  return (
    <St.PdfEditorContainer originalSize={originalSize} scale={scale}>
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

      {isDrawingEditorOpened ? (
        <DrawingEditor
          scale={scale}
          page={currentPage}
          parentContainerRef={containerRef}
        />
      ) : (
        <DrawingEditorContainer>
          {savedImage && <img src={savedImage} alt="Saved Canvas" />}
        </DrawingEditorContainer>
      )}
    </St.PdfEditorContainer>
  );
};

export default PdfEditor;
