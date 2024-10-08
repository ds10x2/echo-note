import React, { useEffect, useRef, useState } from "react";
import * as St from "@components/styles/DrawingEditor.style";
import DrawingToolBar from "@components/DrawingToolBar";
import DrawingCanvas from "@components/DrawingCanvas";
import canvasStore from "@/stores/canvasStore";

const DrawingEditor = ({ scale, page }) => {
  const canvasRef = useRef();
  const [eraseMode, setEraseMode] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [eraserWidth, setEraserWidth] = useState(10);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [readOnly, setReadOnly] = useState(false);

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

  const handleUndoClick = () => {
    canvasRef.current?.undo();
  };

  const handleRedoClick = () => {
    canvasRef.current?.redo();
  };

  const handleClearClick = () => {
    canvasRef.current?.clearCanvas();
  };

  const handleReadOnlyChange = (isReadOnly) => {
    setReadOnly(isReadOnly);
  };

  return (
    <St.DrawingEditorContainer>
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
        onReadOnlyChange={handleReadOnlyChange}
      />
      <DrawingCanvas
        ref={canvasRef}
        strokeWidth={strokeWidth * scale}
        eraserWidth={eraserWidth * scale}
        strokeColor={strokeColor}
        eraseMode={eraseMode}
        readOnly={readOnly}
        scale={scale}
        page={page}
      />
    </St.DrawingEditorContainer>
  );
};

export default DrawingEditor;
