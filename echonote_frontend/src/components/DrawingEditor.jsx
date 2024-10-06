import React, { useRef, useState } from "react";
import * as St from "@components/styles/DrawingEditor.style";
import DrawingToolBar from "@components/DrawingToolBar";
import DrawingCanvas from "@components/DrawingCanvas";
import canvasStore from "@/stores/canvasStore";

const DrawingEditor = () => {
  const { getCanvasPath } = canvasStore.getState();
  const canvasRef = useRef(getCanvasPath());
  const [eraseMode, setEraseMode] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [eraserWidth, setEraserWidth] = useState(10);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [canvasPaths, setCanvasPaths] = useState([]);

  const handleRefChange = (updatedPaths) => {
    setCanvasPaths(updatedPaths);
  };

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

  const handleResetClick = () => {
    canvasRef.current?.resetCanvas();
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
        onResetChange={handleResetClick}
      />
      <DrawingCanvas
        ref={canvasRef}
        strokeWidth={strokeWidth}
        eraserWidth={eraserWidth}
        strokeColor={strokeColor}
        eraseMode={eraseMode}
        onRefChange={handleRefChange}
      />
    </St.DrawingEditorContainer>
  );
};

export default DrawingEditor;
