import React, { useEffect, useRef, useState } from "react";
import * as St from "@components/styles/DrawingEditor.style";
import DrawingToolBar from "@components/DrawingToolBar";
import DrawingCanvas from "@components/DrawingCanvas";
import canvasStore from "@stores/canvasStore";
import drawingTypeStore from "@/stores/drawingTypeStore";

const DrawingEditor = ({ scale, page, readOnly }) => {
  const canvasRef = useRef();
  const [eraseMode, setEraseMode] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [eraserWidth, setEraserWidth] = useState(10);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [noEdit, setNoEdit] = useState(false);
  const { mode } = drawingTypeStore();

  const { undo, redo, clearCanvasPath, getCanvasPath } = canvasStore.getState();

  const handleEraserClick = () => {
    setEraseMode(true);
    canvasRef.current?.eraseMode(true);
  };

  const handlePenClick = () => {
    setEraseMode(false);
    canvasRef.current?.eraseMode(false);
  };

  const handleStrokeWidthChange = (event) => {
    setStrokeWidth(+event.target.value);
  };

  const handleEraserWidthChange = (event) => {
    setEraserWidth(+event.target.value);
  };

  const handleStrokeColorChange = (color) => {
    setStrokeColor(color);
  };

  const loadCanvasPaths = () => {
    const savedPaths = getCanvasPath(page);
    if (canvasRef.current && savedPaths) {
      canvasRef.current.clearCanvas();
      const scaledPaths = savedPaths.map((path) => ({
        ...path,
        strokeWidth: path.strokeWidth * scale,
        paths: path.paths.map((point) => ({
          x: point.x * scale,
          y: point.y * scale,
        })),
      }));

      canvasRef.current.loadPaths(scaledPaths);
    }
  };

  const handleUndoClick = () => {
    undo(page);
    loadCanvasPaths();
  };

  const handleRedoClick = () => {
    redo(page);
    loadCanvasPaths();
  };

  const handleClearClick = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
    clearCanvasPath(page);
  };

  const handleNoEditChange = (isNoEdit) => {
    setNoEdit(isNoEdit);
  };

  useEffect(() => {
    loadCanvasPaths();
  }, [page, scale]);

  return (
    <St.DrawingEditorContainer mode={mode.pen}>
      {mode.pen && (
        <DrawingToolBar
          eraseMode={eraseMode}
          strokeWidth={strokeWidth}
          eraserWidth={eraserWidth}
          strokeColor={strokeColor}
          onPenClick={handlePenClick}
          onEraserClick={handleEraserClick}
          onStrokeWidthChange={handleStrokeWidthChange}
          onEraserWidthChange={handleEraserWidthChange}
          onStrokeColorChange={handleStrokeColorChange}
          onUndoChange={handleUndoClick}
          onRedoChange={handleRedoClick}
          onClearChange={handleClearClick}
          onNoEditChange={handleNoEditChange}
        />
      )}

      <DrawingCanvas
        ref={canvasRef}
        strokeWidth={strokeWidth * scale}
        eraserWidth={eraserWidth * scale}
        strokeColor={strokeColor}
        eraseMode={eraseMode}
        readOnly={readOnly | noEdit}
        scale={scale}
        page={page}
      />
    </St.DrawingEditorContainer>
  );
};

export default DrawingEditor;
