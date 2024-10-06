import React, { forwardRef, useEffect } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import * as St from "@components/styles/DrawingEditor.style";

const DrawingCanvas = forwardRef(({ strokeWidth, eraserWidth, strokeColor, eraseMode }, ref) => {
  useEffect(() => {
    if (ref.current) {
      ref.current.eraseMode(eraseMode);
    }
  }, [eraseMode]);

  return (
    <St.DrawingCanvasContainer>
      <ReactSketchCanvas
        ref={ref}
        strokeColor={strokeColor || "#000"}
        strokeWidth={strokeWidth || 5}
        eraserWidth={eraserWidth || 5}
        width="100%"
        height="100%"
        canvasColor="transparent"
      />
    </St.DrawingCanvasContainer>
  );
});

export default DrawingCanvas;
